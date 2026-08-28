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
  private activeUtterances: SpeechSynthesisUtterance[] = [];
  private audioElement: HTMLAudioElement | null = null;
  private isSpeakingInternal = false;
  private isPausedInternal = false;
  private animFrameId: number | null = null;
  private fallbackTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private currentTokens: string[] = [];
  private currentTokenIndex = 0;
  private currentRate = 1.0;
  private activeMode: 'audio' | 'synth' | 'idle' = 'idle';
  private wordOffset = 0;
  private audioPlaylist: string[] = [];
  private playlistIndex = 0;
  private currentPlayId = 0;
  private abortController: AbortController | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
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
    if (this.cachedVoices.length === 0) {
      this.loadVoices();
    }
    return this.cachedVoices;
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
   * 1. High-Fidelity Server Audio (Sarvam Bulbul Indic / OpenAI / Google TTS)
   * 2. Rock-solid Multi-Sentence Web Speech API Queue (zero 15s cutoff, zero GC bugs)
   */
  public async speak(
    text: string, 
    options: TTSOptions = {}
  ): Promise<void> {
    this.stop();
    const playId = ++this.currentPlayId;

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

    this.isSpeakingInternal = true;
    this.isPausedInternal = false;

    // Abort previous in-flight fetch
    if (this.abortController) {
      try { this.abortController.abort(); } catch {}
    }
    this.abortController = new AbortController();

    // 1. Try High-Fidelity Server Audio Synthesis
    try {
      const res = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: this.abortController.signal,
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

      if (this.currentPlayId !== playId) return;

      if (res.ok) {
        const data = await res.json();
        if (this.currentPlayId !== playId) return;

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
            if (this.currentPlayId !== playId) return;

            if (index >= playlist.length || !this.isSpeakingInternal) {
              this.cleanup();
              options.onEnd?.();
              return;
            }

            if (this.audioElement) {
              try {
                this.audioElement.pause();
                this.audioElement.src = '';
              } catch {}
              this.audioElement = null;
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
              if (this.currentPlayId !== playId) return;
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
              if (this.currentPlayId !== playId) {
                try { audio.pause(); audio.src = ''; } catch {}
                return;
              }
              this.isSpeakingInternal = true;
              this.isPausedInternal = false;
              if (index === 0 && this.currentTokens.length > 0) {
                options.onWordBoundary?.(this.wordOffset, 0, this.currentTokens[0]);
              }
              this.animFrameId = requestAnimationFrame(trackProgress);
            };

            audio.onended = () => {
              if (this.currentPlayId !== playId) return;
              if (this.animFrameId !== null) {
                cancelAnimationFrame(this.animFrameId);
                this.animFrameId = null;
              }
              playNextChunk(index + 1);
            };

            audio.onerror = () => {
              if (this.currentPlayId !== playId) return;
              console.warn(`Audio chunk #${index} error, switching to Web Speech queue`);
              this.speakWithWebSpeechQueue(speechCleanText, targetLang, options, playId);
            };

            try {
              const p = audio.play();
              if (p !== undefined) {
                await p;
              }
            } catch (playErr) {
              if (this.currentPlayId !== playId) return;
              console.warn('HTML5 Audio play rejected, switching to Web Speech queue:', playErr);
              this.speakWithWebSpeechQueue(speechCleanText, targetLang, options, playId);
            }
          };

          await playNextChunk(0);
          return;
        }
      }
    } catch (serverTtsErr: any) {
      if (serverTtsErr.name === 'AbortError' || this.currentPlayId !== playId) {
        return;
      }
      console.warn('Server TTS synthesis failed, using Web Speech queue fallback:', serverTtsErr);
    }

    if (this.currentPlayId !== playId) return;

    // 2. Client Web Speech API Sentence Queue Fallback
    this.speakWithWebSpeechQueue(speechCleanText, targetLang, options, playId);
  }

  /**
   * Sentence-by-Sentence Web Speech Queue:
   * Bypasses Chrome 15s timeout and avoids GC cancellation by chunking into sentences
   */
  private speakWithWebSpeechQueue(
    speechCleanText: string,
    targetLang: string,
    options: TTSOptions,
    playId: number
  ) {
    if (this.currentPlayId !== playId) return;

    const synth = this.getSynth();
    if (!synth) {
      console.warn('SpeechSynthesis is not supported on this browser/environment.');
      options.onError?.('TTS not supported');
      this.cleanup();
      return;
    }

    this.activeMode = 'synth';
    try {
      if (synth.paused) synth.resume();
      synth.cancel();
    } catch {}

    // Ensure audio element is completely detached
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.src = '';
      } catch {}
      this.audioElement = null;
    }

    // Split text into natural sentences/phrases (< 160 characters per utterance)
    const sentences = speechCleanText.match(/[^.!?।\n]+[.!?।\n]+|[^.!?।\n]+$/g) || [speechCleanText];
    const sentenceList = sentences.map(s => s.trim()).filter(s => s.length > 0);

    if (sentenceList.length === 0) {
      options.onEnd?.();
      return;
    }

    // Best matching voice resolution
    const voices = this.getVoices();
    const primaryLang = targetLang.split('-')[0].toLowerCase();
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (options.voiceName) {
      selectedVoice = voices.find(v => v.name.toLowerCase().includes(options.voiceName!.toLowerCase()));
    }
    if (!selectedVoice && voices.length > 0) {
      // Look for exact locale match e.g. 'hi-IN'
      selectedVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(targetLang.toLowerCase()));
      if (!selectedVoice) {
        // Look for language prefix e.g. 'hi'
        selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(primaryLang));
      }
      if (!selectedVoice) {
        // Look for Indian English or natural voice
        selectedVoice = voices.find(v => v.lang.toLowerCase().includes('in') || v.name.toLowerCase().includes('india'));
      }
    }

    // Start Chrome unfreeze heartbeat while speaking
    this.startHeartbeat();

    let currentSentenceIdx = 0;
    let accumulatedWordsBeforeSentence = 0;
    this.activeUtterances = [];

    const playSentence = (idx: number) => {
      if (this.currentPlayId !== playId || !this.isSpeakingInternal) return;

      if (idx >= sentenceList.length) {
        this.cleanup();
        options.onEnd?.();
        return;
      }

      const sentenceText = sentenceList[idx];
      const sentenceTokens = sentenceText.match(/\S+/g) || [];
      const utterance = new SpeechSynthesisUtterance(sentenceText);
      this.currentUtterance = utterance;
      this.activeUtterances.push(utterance); // Prevent GC

      utterance.rate = this.currentRate;
      utterance.pitch = options.pitch || 1.0;
      utterance.lang = targetLang;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      let sentenceHasReceivedBoundary = false;
      const sentenceWordOffset = accumulatedWordsBeforeSentence;

      utterance.onstart = () => {
        if (this.currentPlayId !== playId) {
          try { synth.cancel(); } catch {}
          return;
        }
        this.isSpeakingInternal = true;
        this.isPausedInternal = false;

        // Emit initial word for this sentence
        const firstWordIdx = this.wordOffset + sentenceWordOffset;
        if (sentenceTokens.length > 0) {
          const initWord = this.currentTokens[sentenceWordOffset] || sentenceTokens[0] || '';
          options.onWordBoundary?.(firstWordIdx, 0, initWord);
        }

        const msPerWord = Math.max(130, Math.round(60000 / (150 * this.currentRate)));
        this.startFallbackTimer(
          msPerWord, 
          options.onWordBoundary, 
          () => sentenceHasReceivedBoundary, 
          playId, 
          sentenceTokens.length, 
          sentenceWordOffset
        );
      };

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (this.currentPlayId !== playId) return;
        sentenceHasReceivedBoundary = true;
        this.clearFallbackTimer();

        if (event.name === 'word' || event.charIndex !== undefined) {
          const charIndex = event.charIndex;
          const textUpToChar = sentenceText.substring(0, charIndex);
          const localWordIdx = (textUpToChar.match(/\S+/g) || []).length;
          const globalWordIdx = this.wordOffset + sentenceWordOffset + localWordIdx;
          const currentWord = this.currentTokens[sentenceWordOffset + localWordIdx] || '';

          this.currentTokenIndex = sentenceWordOffset + localWordIdx;
          options.onWordBoundary?.(globalWordIdx, charIndex, currentWord);
        }
      };

      utterance.onend = () => {
        if (this.currentPlayId !== playId) return;
        this.clearFallbackTimer();
        accumulatedWordsBeforeSentence += sentenceTokens.length;
        currentSentenceIdx++;
        playSentence(currentSentenceIdx);
      };

      utterance.onerror = (e) => {
        if (this.currentPlayId !== playId) return;
        console.warn('SpeechSynthesis sentence error:', e);
        this.clearFallbackTimer();
        accumulatedWordsBeforeSentence += sentenceTokens.length;
        currentSentenceIdx++;
        playSentence(currentSentenceIdx);
      };

      try {
        synth.speak(utterance);
      } catch (err) {
        console.warn('Error starting speech utterance:', err);
        options.onError?.(err);
        this.cleanup();
      }
    };

    playSentence(0);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    if (typeof window === 'undefined') return;

    this.heartbeatTimer = window.setInterval(() => {
      const synth = this.getSynth();
      if (synth && this.isSpeakingInternal && !this.isPausedInternal) {
        if (synth.paused) {
          synth.resume();
        }
      }
    }, 5000);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private startFallbackTimer(
    msPerWord: number, 
    onWordBoundary?: (index: number, charIndex: number, word: string) => void,
    hasRealBoundary?: () => boolean,
    playId?: number,
    sentenceWordCount = 0,
    sentenceWordOffset = 0
  ) {
    this.clearFallbackTimer();
    if (typeof window === 'undefined') return;

    let localIdx = 0;
    this.fallbackTimer = window.setInterval(() => {
      if (playId !== undefined && this.currentPlayId !== playId) {
        this.clearFallbackTimer();
        return;
      }
      if (hasRealBoundary && hasRealBoundary()) {
        this.clearFallbackTimer();
        return;
      }

      if (!this.isSpeakingInternal || this.isPausedInternal) return;

      if (localIdx < sentenceWordCount) {
        const globalIdx = this.wordOffset + sentenceWordOffset + localIdx;
        const word = this.currentTokens[sentenceWordOffset + localIdx] || '';
        onWordBoundary?.(globalIdx, 0, word);
        localIdx++;
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
    this.currentPlayId++;
    this.stopHeartbeat();

    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch {}
      this.abortController = null;
    }

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.src = '';
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
    this.activeUtterances = [];
    this.cleanup();
  }

  private cleanup(): void {
    if (this.animFrameId !== null && typeof window !== 'undefined') {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.clearFallbackTimer();
    this.stopHeartbeat();
    this.isSpeakingInternal = false;
    this.isPausedInternal = false;
    this.currentUtterance = null;
    this.activeMode = 'idle';
  }
}

export const ttsService = new TTSService();

