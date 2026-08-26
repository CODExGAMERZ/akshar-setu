import { SupportedLanguage } from '@/types';

export interface TTSEventCallbacks {
  onStart?: () => void;
  onWord?: (wordIndex: number, charIndex: number) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export class TTSService {
  private static synth: SpeechSynthesis | null = null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static isPausedState: boolean = false;
  private static keepAliveInterval: any = null;
  private static wordTimerInterval: any = null;
  private static cachedVoices: SpeechSynthesisVoice[] = [];

  private static initSynth(): SpeechSynthesis | null {
    if (typeof window === 'undefined') return null;
    if (!this.synth && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
    return this.synth;
  }

  private static loadVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      this.cachedVoices = voices;
    }
    return this.cachedVoices;
  }

  private static getLangCode(lang: SupportedLanguage): string {
    const map: Record<SupportedLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      or: 'or-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
    };
    return map[lang] || 'en-IN';
  }

  private static findBestVoice(lang: SupportedLanguage): { voice: SpeechSynthesisVoice | null; langCode: string } {
    const synth = this.initSynth();
    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : (synth?.getVoices() || []);
    const targetLangCode = this.getLangCode(lang);
    const prefix = targetLangCode.split('-')[0];

    // 1. Exact match (e.g. "hi-IN", "ta-IN")
    let voice = voices.find((v) => v.lang.toLowerCase() === targetLangCode.toLowerCase());
    if (voice) return { voice, langCode: voice.lang };

    // 2. Prefix match (e.g. "hi_IN", "hi")
    voice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix.toLowerCase()));
    if (voice) return { voice, langCode: voice.lang };

    // 3. For Indian scripts without specific OS voice (e.g., Odia, Marathi), fallback to Hindi or Indian English voice
    if (['or', 'mr', 'te', 'ta', 'bn'].includes(lang)) {
      const indianVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.lang.toLowerCase().includes('in') ||
          v.name.toLowerCase().includes('india') ||
          v.name.toLowerCase().includes('hindi')
      );
      if (indianVoice) return { voice: indianVoice, langCode: indianVoice.lang };
    }

    // 4. Default voice or first available
    const defaultVoice = voices.find((v) => v.default) || voices[0] || null;
    return { voice: defaultVoice, langCode: defaultVoice ? defaultVoice.lang : targetLangCode };
  }

  public static speak(
    text: string,
    lang: SupportedLanguage = 'en',
    rate: number = 0.95,
    callbacks?: TTSEventCallbacks
  ): void {
    const synth = this.initSynth();
    if (!synth) {
      callbacks?.onError?.('SpeechSynthesis not supported on this device');
      return;
    }

    // Clear any previous execution and timers
    this.stop();

    const cleanText = text.replace(/\s+/g, ' ').trim();
    if (!cleanText) {
      callbacks?.onEnd?.();
      return;
    }

    const { voice, langCode } = this.findBestVoice(lang);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode || this.getLangCode(lang);
    utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    utterance.pitch = 1.0;

    if (voice) {
      utterance.voice = voice;
    }

    const words = cleanText.split(/\s+/).filter(Boolean);
    const totalWords = words.length;
    let wordIndex = 0;
    let boundaryFired = false;

    // Fallback word highlighting timer if browser TTS doesn't trigger onboundary events
    const startWordTimer = () => {
      this.clearWordTimer();
      // Estimate average milliseconds per word based on speech rate
      const msPerWord = Math.max(150, Math.round(340 / utterance.rate));
      this.wordTimerInterval = setInterval(() => {
        if (this.isPausedState) return;
        if (!boundaryFired && wordIndex < totalWords) {
          callbacks?.onWord?.(wordIndex, 0);
          wordIndex++;
        } else if (wordIndex >= totalWords) {
          this.clearWordTimer();
        }
      }, msPerWord);
    };

    utterance.onstart = () => {
      this.isPausedState = false;
      callbacks?.onStart?.();
      callbacks?.onWord?.(0, 0);
      wordIndex = 1;
      startWordTimer();

      // Chrome keep-alive bug fix: periodically pulse pause/resume to prevent 15-second cutoff
      this.clearKeepAlive();
      this.keepAliveInterval = setInterval(() => {
        if (synth && synth.speaking && !synth.paused) {
          synth.pause();
          synth.resume();
        }
      }, 10000);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word' || event.name === '') {
        boundaryFired = true;
        this.clearWordTimer();
        callbacks?.onWord?.(wordIndex++, event.charIndex);
      }
    };

    utterance.onend = () => {
      this.cleanUp();
      callbacks?.onEnd?.();
    };

    utterance.onerror = (err) => {
      // Ignore errors caused by manual cancel
      if (err.error !== 'canceled' && err.error !== 'interrupted') {
        console.warn('TTS Synthesis notification:', err);
      }
      this.cleanUp();
      callbacks?.onEnd?.();
    };

    this.currentUtterance = utterance;

    // Small timeout ensures Chrome processes synth.cancel() before queueing new utterance
    setTimeout(() => {
      try {
        synth.speak(utterance);
        // If Chrome is stuck in a paused state, force resume
        if (synth.paused) {
          synth.resume();
        }
      } catch (err) {
        console.error('Failed to trigger speech synthesis', err);
        callbacks?.onError?.(err);
      }
    }, 60);
  }

  public static pause(): void {
    const synth = this.initSynth();
    if (synth && !this.isPausedState) {
      synth.pause();
      this.isPausedState = true;
    }
  }

  public static resume(): void {
    const synth = this.initSynth();
    if (synth && this.isPausedState) {
      synth.resume();
      this.isPausedState = false;
    }
  }

  public static stop(): void {
    const synth = this.initSynth();
    this.cleanUp();
    if (synth) {
      try {
        synth.cancel();
      } catch (e) {
        console.warn('Error during synth cancel', e);
      }
    }
  }

  public static isSpeaking(): boolean {
    const synth = this.initSynth();
    return !!synth && (synth.speaking || this.isPausedState);
  }

  private static clearWordTimer(): void {
    if (this.wordTimerInterval) {
      clearInterval(this.wordTimerInterval);
      this.wordTimerInterval = null;
    }
  }

  private static clearKeepAlive(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  private static cleanUp(): void {
    this.currentUtterance = null;
    this.isPausedState = false;
    this.clearWordTimer();
    this.clearKeepAlive();
  }
}
