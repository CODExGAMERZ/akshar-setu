import { SupportedLanguage } from '@/types';
import { StorageService } from '@/lib/storage';

// Client-side in-memory translation cache
const translationCache = new Map<string, string>();

export class TranslationService {
  public static async translateText(
    text: string,
    targetLang: SupportedLanguage,
    title?: string
  ): Promise<string> {
    if (!text) return '';

    // If English to English, return early
    if (targetLang === 'en') {
      return text;
    }

    const cacheKey = `${targetLang}_${text.length}_${text.slice(0, 40)}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    // Check user BYOK API configuration from Storage
    const apiConfig = StorageService.getApiConfig();
    let apiKey = '';
    let provider = apiConfig.provider;

    if (apiConfig.useCustomKey) {
      if (apiConfig.provider === 'gemini') apiKey = apiConfig.geminiKey || '';
      else if (apiConfig.provider === 'openai') apiKey = apiConfig.openaiKey || '';
      else if (apiConfig.provider === 'groq') apiKey = apiConfig.groqKey || '';
      else if (apiConfig.provider === 'sarvam') apiKey = apiConfig.sarvamKey || '';
    }

    // Call API route
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLang,
          apiKey: apiKey || undefined,
          provider: apiConfig.useCustomKey ? provider : 'server-default',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translatedText && data.translatedText.trim().length > 0) {
          translationCache.set(cacheKey, data.translatedText);
          return data.translatedText;
        }
      }
    } catch (err) {
      console.warn('Translation API request failed:', err);
    }

    return text;
  }
}
