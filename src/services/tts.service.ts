import { SupportedLanguage } from '@/types';
import { StorageService } from '@/lib/storage';

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
  private static currentAudioElement: HTMLAudioElement | null = null;
  private static audioPlaylist: string[] = [];
  private static currentPlaylistIndex: number = 0;
  private static activeCallbacks: TTSEventCallbacks | null = null;
  private static isServerAudioPlaying: boolean = false;

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
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        this.cachedVoices = voices;
      }
    } catch {
      // Ignored
    }
    return this.cachedVoices;
  }

  public static getLangCode(lang: SupportedLanguage): string {
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

  private static findBestVoice(lang: SupportedLanguage): SpeechSynthesisVoice | null {
    const synth = this.initSynth();
    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : synth?.getVoices() || [];
    if (!voices || voices.length === 0) return null;

    const targetLangCode = this.getLangCode(lang).toLowerCase();
    const prefix = targetLangCode.split('-')[0];

    // 1. Exact match (e.g. "hi-IN", "ta-IN", "en-IN")
    let match = voices.find((v) => v.lang.toLowerCase() === targetLangCode);
    if (match) return match;

    // 2. Prefix match (e.g. "hi", "ta", "en")
    match = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (match) return match;

    // 3. Match by name (e.g. "Hindi", "Tamil", "India")
    match = voices.find(
      (v) => v.name.toLowerCase().includes(prefix) || v.name.toLowerCase().includes(lang)
    );
    if (match) return match;

    // 4. For English: pick any English voice
    if (lang === 'en') {
      match = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
      if (match) return match;
    }

    // 5. For Indic languages without specific regional voice: match Indian voice if available
    if (['hi', 'mr', 'or', 'bn', 'ta', 'te'].includes(lang)) {
      match = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.lang.toLowerCase().includes('in') ||
          v.name.toLowerCase().includes('india')
      );
      if (match) return match;
    }

    return null;
  }

  /**
   * Main Speak Entrypoint:
   * First attempts high-quality server TTS (Sarvam AI / OpenAI / Server Google Proxy)
   * with automatic fallback to client-side Web Speech API.
   */
  public static async speak(
    text: string,
    lang: SupportedLanguage = 'en',
    rate: number = 1.0,
    callbacks?: TTSEventCallbacks
  ): Promise<void> {
    const cleanText = text
      .replace(/[*#_~`>•\-]/g, ' ')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      callbacks?.onEnd?.();
      return;
    }

    this.stop();
    this.activeCallbacks = callbacks || null;

    // Retrieve active API config (BYOK or server default)
    const apiConfig = StorageService.getApiConfig();
    let apiKey = '';
    let provider = apiConfig.provider;

    if (apiConfig.useCustomKey) {
      if (apiConfig.provider === 'gemini') apiKey = apiConfig.geminiKey || '';
      else if (apiConfig.provider === 'openai') apiKey = apiConfig.openaiKey || '';
      else if (apiConfig.provider === 'groq') apiKey = apiConfig.groqKey || '';
      else if (apiConfig.provider === 'sarvam') apiKey = apiConfig.sarvamKey || '';
    }

    // Attempt Server-Side High Fidelity TTS (Sarvam / OpenAI / Google Proxy)
    try {
      const response = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          lang,
          rate,
          apiKey: apiKey || undefined,
          provider: apiConfig.useCustomKey ? provider : 'server-default',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioData && data.status === 'success') {
          const playlist = data.allAudios && data.allAudios.length > 0 ? data.allAudios : [data.audioData];
          this.playAudioPlaylist(playlist, cleanText, rate, callbacks);
          return;
        }
      }
    } catch (err) {
      console.warn('Server TTS synthesis call failed, switching to client Web Speech API:', err);
    }

    // Fallback to client browser SpeechSynthesis
    this.speakWithWebSpeech(cleanText, lang, rate, callbacks);
  }

  /**
   * Plays audio data streams with synced karaoke word tracking
   */
  private static playAudioPlaylist(
    playlist: string[],
    fullText: string,
    rate: number,
    callbacks?: TTSEventCallbacks
  ): void {
    if (!playlist || playlist.length === 0) {
      callbacks?.onEnd?.();
      return;
    }

    this.audioPlaylist = playlist;
    this.currentPlaylistIndex = 0;
    this.isServerAudioPlaying = true;
    this.isPausedState = false;

    const words = fullText.split(/\s+/).filter(Boolean);
    const totalWords = words.length;
    let wordIndex = 0;

    const playNextTrack = (trackIndex: number) => {
      if (trackIndex >= this.audioPlaylist.length) {
        this.cleanUp();
        callbacks?.onEnd?.();
        return;
      }

      const audio = new Audio(this.audioPlaylist[trackIndex]);
      audio.playbackRate = Math.max(0.6, Math.min(1.6, rate));
      this.currentAudioElement = audio;

      audio.onplay = () => {
        this.isPausedState = false;
        if (trackIndex === 0) {
          callbacks?.onStart?.();
          callbacks?.onWord?.(0, 0);
          wordIndex = 1;
        }

        this.clearWordTimer();
        // Dynamic time-based tracking
        this.wordTimerInterval = setInterval(() => {
          if (this.isPausedState || !audio.duration || isNaN(audio.duration)) return;

          const progress = audio.currentTime / audio.duration;
          const chunkWordCount = Math.ceil(totalWords / this.audioPlaylist.length);
          const baseIndex = trackIndex * chunkWordCount;
          const currentTrackWord = Math.floor(progress * chunkWordCount);
          const calculatedIndex = Math.min(totalWords - 1, baseIndex + currentTrackWord);

          if (calculatedIndex >= 0 && calculatedIndex < totalWords) {
            callbacks?.onWord?.(calculatedIndex, 0);
          }
        }, 120);
      };

      audio.onended = () => {
        this.clearWordTimer();
        this.currentPlaylistIndex++;
        if (this.currentPlaylistIndex < this.audioPlaylist.length) {
          playNextTrack(this.currentPlaylistIndex);
        } else {
          this.cleanUp();
          callbacks?.onEnd?.();
        }
      };

      audio.onerror = (e) => {
        console.warn('Audio playback error on track:', e);
        this.cleanUp();
        // If first track fails, try client Web Speech API fallback
        if (trackIndex === 0) {
          this.speakWithWebSpeech(fullText, 'en', rate, callbacks);
        } else {
          callbacks?.onEnd?.();
        }
      };

      audio.play().catch((err) => {
        console.warn('Audio play invocation prevented:', err);
        this.speakWithWebSpeech(fullText, 'en', rate, callbacks);
      });
    };

    playNextTrack(0);
  }

  /**
   * Client-side Web Speech API implementation with utterance slicing
   * to bypass browser 15s freeze bug and maintain synchronized word highlights.
   */
  private static speakWithWebSpeech(
    text: string,
    lang: SupportedLanguage,
    rate: number,
    callbacks?: TTSEventCallbacks
  ): void {
    const synth = this.initSynth();
    if (!synth) {
      callbacks?.onEnd?.();
      return;
    }

    try {
      synth.cancel();
      if (synth.paused) {
        synth.resume();
      }

      const langCode = this.getLangCode(lang);
      const voice = this.findBestVoice(lang);

      const words = text.split(/\s+/).filter(Boolean);
      const totalWords = words.length;
      let wordIndex = 0;
      let boundaryFired = false;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voice ? voice.lang : langCode;
      utterance.rate = Math.max(0.6, Math.min(1.8, rate));
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (voice) {
        utterance.voice = voice;
      }

      const startWordTimer = () => {
        this.clearWordTimer();
        const msPerWord = Math.max(120, Math.round(320 / utterance.rate));
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

        // Browser keep-alive pulse
        this.clearKeepAlive();
        this.keepAliveInterval = setInterval(() => {
          if (synth && synth.speaking && !synth.paused) {
            synth.pause();
            synth.resume();
          }
        }, 6000);
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
        if (err.error !== 'canceled' && err.error !== 'interrupted') {
          console.warn('SpeechSynthesis browser event notice:', err);
        }
        this.cleanUp();
        callbacks?.onEnd?.();
      };

      this.currentUtterance = utterance;
      synth.speak(utterance);
    } catch (e) {
      console.error('Error with Web Speech API:', e);
      this.cleanUp();
      callbacks?.onEnd?.();
    }
  }

  public static pause(): void {
    const synth = this.initSynth();
    if (synth && synth.speaking && !this.isPausedState) {
      synth.pause();
      this.isPausedState = true;
    }
    if (this.currentAudioElement && !this.currentAudioElement.paused) {
      this.currentAudioElement.pause();
      this.isPausedState = true;
    }
  }

  public static resume(): void {
    const synth = this.initSynth();
    if (synth && this.isPausedState) {
      synth.resume();
      this.isPausedState = false;
    }
    if (this.currentAudioElement && this.isPausedState) {
      this.currentAudioElement.play().catch(console.warn);
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

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement = null;
      } catch {
        // Ignored
      }
    }
  }

  public static isSpeaking(): boolean {
    const synth = this.initSynth();
    const synthSpeaking = !!synth && (synth.speaking || this.isPausedState);
    const audioSpeaking =
      !!this.currentAudioElement && (!this.currentAudioElement.paused || this.isPausedState);
    return synthSpeaking || audioSpeaking;
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
    this.isServerAudioPlaying = false;
    this.clearWordTimer();
    this.clearKeepAlive();
    this.audioPlaylist = [];
    this.currentPlaylistIndex = 0;
    if (this.currentAudioElement) {
      this.currentAudioElement = null;
    }
  }
}
