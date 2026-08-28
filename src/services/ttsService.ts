export interface TTSOptions {
  rate?: number;
  pitch?: number;
  voiceName?: string;
  speaker?: string;
  lang?: string;
  wordOffset?: number;
  provider?: string;
  apiKey?: string;
  onWordBoundary?: (wordIndex: number, charIndex: number, word: string) => void;
  onSentenceBoundary?: (sentenceIndex: number) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isSpeakingInternal = false;
  private isPausedInternal = false;
  private animFrameId: number | null = null;
  private fallbackTimer: number | null = null;
  private currentTokens: string[] = [];
  private currentTokenIndex = 0;
  private currentRate = 1.0;
  private activeMode: 'audio' | 'synth' | 'idle' = 'idle';
  private wordOffset = 0;
  private audioPlaylist: string[] = [];
  private playlistIndex = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  private getSynth(): SpeechSynthesis | null {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
    return this.synth;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined';
  }

  public getVoices(): SpeechSynthesisVoice[] {
    const synth = this.getSynth();
    if (!synth) return [];
    return synth.getVoices();
  }

  public setRate(rate: number) {
    this.currentRate = Math.max(0.5, Math.min(2.0, rate));
    if (this.audioElement) {
      this.audioElement.playbackRate = this.currentRate;
    }
    if (this.currentUtterance) {
      this.currentUtterance.rate = this.currentRate;
    }
  }

  /**
   * Speak text with Dual Engine:
   * 1. High-Fidelity Server Audio (Sarvam Bulbul Indic / OpenAI / Google TTS) via HTML5 Audio with multi-chunk chaining
   * 2. Web Speech API client fallback
   */
  public async speak(
    text: string, 
    options: TTSOptions = {}
  ): Promise<void> {
    this.stop();

    const speechCleanText = text
      .replace(/[*#_~`>•\-]/g, ' ')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    if (!speechCleanText) {
      options.onEnd?.();
      return;
    }

    this.currentTokens = text.match(/\S+/g) || speechCleanText.match(/\S+/g) || [];
    this.currentTokenIndex = 0;
    this.wordOffset = options.wordOffset || 0;
    this.currentRate = options.rate || this.currentRate || 1.0;
    const targetLang = options.lang || 'en-IN';
    const langCode = targetLang.split('-')[0].toLowerCase();

    this.isSpeakingInternal = true;
    this.isPausedInternal = false;

    // 1. Try High-Fidelity Server Audio Synthesis (Sarvam AI Bulbul Indic Audio & Server TTS)
    try {
      const res = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: speechCleanText,
          lang: targetLang,
          rate: this.currentRate,
          speaker: options.speaker || options.voiceName,
          voiceName: options.voiceName,
          provider: options.provider || 'sarvam',
          apiKey: options.apiKey,
        })
      });

      if (res.ok) {
        const data = await res.json();
        const playlist: string[] = (Array.isArray(data.allAudios) && data.allAudios.length > 0)
          ? data.allAudios
          : (data.audioData ? [data.audioData] : []);

        if (playlist.length > 0 && data.status === 'success') {
          this.activeMode = 'audio';
          this.audioPlaylist = playlist;
          this.playlistIndex = 0;

          const totalWords = this.currentTokens.length;
          const wordsPerChunk = Math.max(1, Math.ceil(totalWords / playlist.length));

          const playNextChunk = async (index: number) => {
            if (index >= playlist.length || !this.isSpeakingInternal) {
              this.cleanup();
              options.onEnd?.();
              return;
            }

            this.playlistIndex = index;
            const audioSrc = playlist[index];
            const audio = new Audio(audioSrc);
            this.audioElement = audio;
            audio.playbackRate = this.currentRate;

            const chunkStartWord = index * wordsPerChunk;
            const chunkEndWord = Math.min(totalWords, (index + 1) * wordsPerChunk);
            const chunkWordCount = Math.max(1, chunkEndWord - chunkStartWord);

            const trackProgress = () => {
              if (!this.isSpeakingInternal || this.isPausedInternal || !audio || audio.paused) return;

              if (audio.duration && audio.duration > 0 && totalWords > 0) {
                const chunkProgress = audio.currentTime / audio.duration;
                const relativeWord = Math.floor(chunkProgress * chunkWordCount);
                const wordIdx = Math.min(totalWords - 1, chunkStartWord + relativeWord);

                if (wordIdx !== this.currentTokenIndex) {
                  this.currentTokenIndex = wordIdx;
                  const currentWord = this.currentTokens[wordIdx] || '';
                  const actualWordIndex = this.wordOffset + wordIdx;
                  options.onWordBoundary?.(actualWordIndex, 0, currentWord);
                }
              }

              this.animFrameId = requestAnimationFrame(trackProgress);
            };

            audio.onplay = () => {
              this.isSpeakingInternal = true;
              this.isPausedInternal = false;
              if (index === 0 && this.currentTokens.length > 0) {
                options.onWordBoundary?.(this.wordOffset, 0, this.currentTokens[0]);
              }
              this.animFrameId = requestAnimationFrame(trackProgress);
            };

            audio.onended = () => {
              if (this.animFrameId !== null) {
                cancelAnimationFrame(this.animFrameId);
                this.animFrameId = null;
              }
              playNextChunk(index + 1);
            };

            audio.onerror = (e) => {
              console.warn(`Audio chunk #${index} playback error, switching to SpeechSynthesis:`, e);
              this.cleanup();
              this.speakWithSpeechSynthesis(speechCleanText, targetLang, options);
            };

            await audio.play();
          };

          await playNextChunk(0);
          return;
        }
      }
    } catch (serverTtsErr) {
      console.warn('Server TTS synthesis failed, trying client speech synthesis:', serverTtsErr);
    }

    // 2. Client Web Speech API Fallback
    this.speakWithSpeechSynthesis(speechCleanText, targetLang, options);
  }

  private speakWithSpeechSynthesis(
    speechCleanText: string,
    targetLang: string,
    options: TTSOptions
  ) {
    const synth = this.getSynth();
    if (!synth) {
      console.warn('SpeechSynthesis is not supported on this browser/environment.');
      options.onError?.('TTS not supported');
      this.cleanup();
      return;
    }

    this.activeMode = 'synth';
    try {
      synth.cancel();
      if (synth.paused) synth.resume();
    } catch {
      // ignore
    }

    const utterance = new SpeechSynthesisUtterance(speechCleanText);
    this.currentUtterance = utterance;
    utterance.rate = this.currentRate;
    utterance.pitch = options.pitch || 1.0;
    utterance.lang = targetLang;

    const voices = this.getVoices();
    if (options.voiceName) {
      const explicit = voices.find(v => v.name === options.voiceName);
      if (explicit) utterance.voice = explicit;
    } else if (voices.length > 0) {
      const primaryLangCode = targetLang.split('-')[0].toLowerCase();
      const matched = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(primaryLangCode));
      if (matched) utterance.voice = matched;
    }

    let hasReceivedBoundary = false;

    utterance.onstart = () => {
      this.isSpeakingInternal = true;
      this.isPausedInternal = false;

      const estimatedMsPerWord = Math.max(120, Math.round(60000 / (150 * this.currentRate)));
      this.startFallbackTimer(estimatedMsPerWord, options.onWordBoundary, () => hasReceivedBoundary);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      hasReceivedBoundary = true;
      this.clearFallbackTimer();

      if (event.name === 'word' || event.charIndex !== undefined) {
        const charIndex = event.charIndex;
        const textUpToChar = speechCleanText.substring(0, charIndex);
        const wordIndex = (textUpToChar.match(/\S+/g) || []).length;
        const currentWord = this.currentTokens[wordIndex] || '';

        this.currentTokenIndex = wordIndex;
        const actualWordIndex = this.wordOffset + wordIndex;
        options.onWordBoundary?.(actualWordIndex, charIndex, currentWord);
      }
    };

    utterance.onend = () => {
      this.cleanup();
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('TTS utterance error:', e);
      this.cleanup();
      options.onError?.(e);
    };

    try {
      synth.speak(utterance);
    } catch (err) {
      console.warn('Error initiating synth.speak:', err);
      options.onError?.(err);
      this.cleanup();
    }
  }

  private startFallbackTimer(
    msPerWord: number, 
    onWordBoundary?: (index: number, charIndex: number, word: string) => void,
    hasRealBoundary?: () => boolean
  ) {
    this.clearFallbackTimer();
    if (typeof window === 'undefined') return;

    this.fallbackTimer = window.setInterval(() => {
      if (hasRealBoundary && hasRealBoundary()) {
        this.clearFallbackTimer();
        return;
      }

      if (!this.isSpeakingInternal || this.isPausedInternal) return;

      if (this.currentTokenIndex < this.currentTokens.length) {
        const word = this.currentTokens[this.currentTokenIndex] || '';
        const actualWordIndex = this.wordOffset + this.currentTokenIndex;
        onWordBoundary?.(actualWordIndex, 0, word);
        this.currentTokenIndex++;
      } else {
        this.clearFallbackTimer();
      }
    }, msPerWord);
  }

  private clearFallbackTimer() {
    if (this.fallbackTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  public pause(): void {
    if (this.audioElement && !this.audioElement.paused) {
      try {
        this.audioElement.pause();
      } catch {}
      this.isPausedInternal = true;
    }

    const synth = this.getSynth();
    if (synth && this.isSpeakingInternal && !this.isPausedInternal) {
      try {
        synth.pause();
      } catch {}
      this.isPausedInternal = true;
    }
  }

  public resume(): void {
    if (this.audioElement && this.audioElement.paused) {
      try {
        this.audioElement.play();
      } catch {}
      this.isPausedInternal = false;
    }

    const synth = this.getSynth();
    if (synth && this.isPausedInternal) {
      try {
        synth.resume();
      } catch {}
      this.isPausedInternal = false;
    }
  }

  public stop(): void {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {}
      this.audioElement = null;
    }

    const synth = this.getSynth();
    if (synth) {
      try {
        synth.cancel();
      } catch {}
    }
    this.audioPlaylist = [];
    this.playlistIndex = 0;
    this.cleanup();
  }

  private cleanup(): void {
    if (this.animFrameId !== null && typeof window !== 'undefined') {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.clearFallbackTimer();
    this.isSpeakingInternal = false;
    this.isPausedInternal = false;
    this.currentUtterance = null;
    this.activeMode = 'idle';
  }
}

export const ttsService = new TTSService();

