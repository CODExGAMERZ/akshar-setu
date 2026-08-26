export interface TTSOptions {
  rate?: number;
  pitch?: number;
  voiceName?: string;
  lang?: string;
  onWordBoundary?: (wordIndex: number, charIndex: number, word: string) => void;
  onSentenceBoundary?: (sentenceIndex: number) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingInternal = false;
  private isPausedInternal = false;
  private fallbackTimer: number | null = null;
  private currentTokens: string[] = [];
  private currentTokenIndex = 0;
  private currentRate = 1.0;

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
    return !!this.getSynth();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    const synth = this.getSynth();
    if (!synth) return [];
    return synth.getVoices();
  }

  public setRate(rate: number) {
    this.currentRate = Math.max(0.5, Math.min(2.0, rate));
    if (this.currentUtterance) {
      this.currentUtterance.rate = this.currentRate;
    }
  }

  public speak(
    text: string, 
    options: TTSOptions = {}
  ): void {
    const synth = this.getSynth();
    if (!synth) {
      console.warn('SpeechSynthesis is not supported on this browser/environment.');
      options.onError?.('TTS not supported');
      return;
    }

    // Clear previous speech state & stuck audio queues
    this.stop();
    try {
      synth.cancel();
      if (synth.paused) {
        synth.resume();
      }
    } catch {
      // ignore
    }

    // Clean text of markdown artefacts for natural speech
    const speechCleanText = text
      .replace(/[*#_~`>•\-]/g, ' ')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    if (!speechCleanText) {
      options.onEnd?.();
      return;
    }

    // Prepare token array matching reading canvas
    this.currentTokens = text.match(/\S+/g) || speechCleanText.match(/\S+/g) || [];
    this.currentTokenIndex = 0;
    this.currentRate = options.rate || this.currentRate || 1.0;

    const utterance = new SpeechSynthesisUtterance(speechCleanText);
    this.currentUtterance = utterance;
    utterance.rate = this.currentRate;
    utterance.pitch = options.pitch || 1.0;
    
    // Set language (e.g. 'hi-IN', 'ta-IN', 'en-IN')
    const targetLang = options.lang || 'en-IN';
    utterance.lang = targetLang;

    // Select the best matching voice
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

      // Start fallback pacing timer in case the browser does not emit boundary events
      const estimatedMsPerWord = Math.max(120, Math.round(60000 / (150 * this.currentRate)));
      this.startFallbackTimer(estimatedMsPerWord, options.onWordBoundary, () => {
        return hasReceivedBoundary;
      });
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
        options.onWordBoundary?.(wordIndex, charIndex, currentWord);
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
        onWordBoundary?.(this.currentTokenIndex, 0, word);
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
    const synth = this.getSynth();
    if (synth && this.isSpeakingInternal && !this.isPausedInternal) {
      try {
        synth.pause();
      } catch {
        // ignore
      }
      this.isPausedInternal = true;
    }
  }

  public resume(): void {
    const synth = this.getSynth();
    if (synth && this.isPausedInternal) {
      try {
        synth.resume();
      } catch {
        // ignore
      }
      this.isPausedInternal = false;
    }
  }

  public stop(): void {
    const synth = this.getSynth();
    if (synth) {
      try {
        synth.cancel();
      } catch {
        // ignore
      }
    }
    this.cleanup();
  }

  private cleanup(): void {
    this.clearFallbackTimer();
    this.isSpeakingInternal = false;
    this.isPausedInternal = false;
    this.currentUtterance = null;
  }
}

export const ttsService = new TTSService();
