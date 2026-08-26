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

  public isSupported(): boolean {
    return !!this.synth;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
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
    if (typeof window === 'undefined' || !this.synth) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      } else {
        console.warn('SpeechSynthesis is not supported on this browser/environment.');
        options.onError?.('TTS not supported');
        return;
      }
    }

    this.stop();

    // Prepare tokens for DOM synchronized mapping
    this.currentTokens = text.match(/\S+/g) || [];
    this.currentTokenIndex = 0;
    this.currentRate = options.rate || this.currentRate || 1.0;

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    utterance.rate = this.currentRate;
    utterance.pitch = options.pitch || 1.0;
    utterance.lang = options.lang || 'en-IN';

    // Select voice if requested
    if (options.voiceName) {
      const voices = this.getVoices();
      const matched = voices.find(v => v.name === options.voiceName || v.lang.startsWith(options.lang || 'en'));
      if (matched) utterance.voice = matched;
    }

    let hasReceivedBoundary = false;

    utterance.onstart = () => {
      this.isSpeakingInternal = true;
      this.isPausedInternal = false;

      // Start fallback pacing timer in case boundary events are not fired by the browser engine
      const estimatedMsPerWord = (60000 / (160 * this.currentRate));
      this.startFallbackTimer(estimatedMsPerWord, options.onWordBoundary, () => {
        return hasReceivedBoundary;
      });
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      hasReceivedBoundary = true;
      this.clearFallbackTimer();

      if (event.name === 'word') {
        const charIndex = event.charIndex;
        // Compute word index from charIndex
        const textUpToChar = text.substring(0, charIndex);
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

    this.synth.speak(utterance);
  }

  private startFallbackTimer(
    msPerWord: number, 
    onWordBoundary?: (index: number, charIndex: number, word: string) => void,
    hasRealBoundary?: () => boolean
  ) {
    this.clearFallbackTimer();
    if (typeof window === 'undefined') return;

    const interval = window.setInterval(() => {
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
    }, Math.max(120, msPerWord));

    this.fallbackTimer = interval as unknown as number;
  }

  private clearFallbackTimer() {
    if (this.fallbackTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  public pause(): void {
    if (this.synth && this.isSpeakingInternal && !this.isPausedInternal) {
      this.synth.pause();
      this.isPausedInternal = true;
    }
  }

  public resume(): void {
    if (this.synth && this.isPausedInternal) {
      this.synth.resume();
      this.isPausedInternal = false;
    }
  }

  public stop(): void {
    this.clearFallbackTimer();
    if (this.synth) {
      this.synth.cancel();
    }
    this.cleanup();
  }

  private cleanup(): void {
    this.clearFallbackTimer();
    this.isSpeakingInternal = false;
    this.isPausedInternal = false;
    this.currentUtterance = null;
    this.currentTokenIndex = 0;
  }

  public isPlaying(): boolean {
    return this.isSpeakingInternal && !this.isPausedInternal;
  }

  public isPaused(): boolean {
    return this.isPausedInternal;
  }
}

export const ttsService = new TTSService();
