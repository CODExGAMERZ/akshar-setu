import { StorageService } from '@/lib/storage';

export class SimplificationService {
  /**
   * Simplifies text vocabulary and sentence structures using AI with graceful fallback.
   */
  public static async simplifyText(
    text: string,
    level: 'off' | 'light' | 'medium' | 'heavy' = 'medium',
    title?: string
  ): Promise<string> {
    if (level === 'off' || !text) {
      return text;
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

    // Call API route for real AI simplification
    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          level,
          apiKey: apiKey || undefined,
          provider: apiConfig.useCustomKey ? provider : 'server-default',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.simplifiedText && data.simplifiedText.trim().length > 0 && data.status !== 'fallback') {
          return data.simplifiedText;
        }
      }
    } catch (err) {
      console.warn('Simplification API request failed:', err);
    }

    // Fallback to client-side rule-based simplification
    return this.ruleBasedSimplification(text, level);
  }

  public static ruleBasedSimplification(text: string, level: 'light' | 'medium' | 'heavy'): string {
    const dictionary: [RegExp, string][] = [
      [/\bconsists of\b/gi, 'is made of'],
      [/\bcomprising\b/gi, 'made of'],
      [/\bapproximately\b/gi, 'about'],
      [/\butilizing\b|\butilize\b|\butilized\b/gi, 'using'],
      [/\bfacilitate\b/gi, 'help'],
      [/\bdemonstrate\b/gi, 'show'],
      [/\bsufficient\b/gi, 'enough'],
      [/\bcommence\b|\bcommenced\b/gi, 'start'],
      [/\bterminate\b|\bterminated\b/gi, 'end'],
      [/\bsubsequently\b/gi, 'then'],
      [/\bfurthermore\b|\bmoreover\b/gi, 'also'],
      [/\bnevertheless\b/gi, 'still'],
      [/\bin order to\b/gi, 'to'],
      [/\bdue to the fact that\b/gi, 'because'],
      [/\bas a consequence of\b/gi, 'because of'],
      [/\bmicrobial\b/gi, 'tiny microscopic'],
      [/\bformation\b/gi, 'beginning'],
      [/\bfascinating\b/gi, 'amazing'],
      [/\bpredominantly\b/gi, 'mostly'],
    ];

    let result = text;
    for (const [regex, replacement] of dictionary) {
      result = result.replace(regex, replacement);
    }

    if (level === 'light') {
      result = result.replace(/; /g, '. ');
      return result;
    }

    if (level === 'medium') {
      result = result
        .replace(/; /g, '. ')
        .replace(/, and /g, '. Also, ')
        .replace(/, while /g, '. Meanwhile, ')
        .replace(/, but /g, '. However, ');
      return result;
    }

    if (level === 'heavy') {
      const paragraphs = result.split('\n\n').filter((p) => p.trim().length > 0);
      const bulleted = paragraphs.map((para) => {
        const sentences = para
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 5);

        if (sentences.length <= 1) {
          return `• ${para.trim()}`;
        }
        return sentences.map((s) => `• ${s.replace(/^•\s*/, '')}`).join('\n');
      });
      return bulleted.join('\n\n');
    }

    return result;
  }
}
