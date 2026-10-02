import { SUPPORTED_LANGUAGES, LanguageDefinition, getLanguage, ScriptName } from '@/data/languages';

/**
 * Normalizes text to Unicode NFC form.
 * CRITICAL: Preserves Zero-Width Joiner (ZWJ \u200D) and Zero-Width Non-Joiner (ZWNJ \u200C)
 * which are vital for Indic conjuncts (Odia, Hindi, Bengali, Tamil, etc.).
 */
export function normalizeNFC(text: string): string {
  if (!text) return '';
  return text.normalize('NFC');
}

/**
 * Detects the dominant script in a string.
 * Supports word-level and paragraph-level detection across Devanagari, Odia, Bengali, Tamil,
 * Telugu, Gujarati, Kannada, Malayalam, Gurmukhi, Arabic/Urdu, and Latin.
 */
export function detectScript(text: string): ScriptName {
  if (!text) return 'Latin';

  const scriptCounts: Record<string, number> = {
    Devanagari: 0,
    Odia: 0,
    Bengali: 0,
    Tamil: 0,
    Telugu: 0,
    Gujarati: 0,
    Kannada: 0,
    Malayalam: 0,
    Gurmukhi: 0,
    Arabic: 0,
    Latin: 0
  };

  for (const char of text) {
    const code = char.codePointAt(0);
    if (!code) continue;

    if (code >= 0x0900 && code <= 0x097F) scriptCounts.Devanagari++;
    else if (code >= 0x0B00 && code <= 0x0B7F) scriptCounts.Odia++;
    else if (code >= 0x0980 && code <= 0x09FF) scriptCounts.Bengali++;
    else if (code >= 0x0B80 && code <= 0x0BFF) scriptCounts.Tamil++;
    else if (code >= 0x0C00 && code <= 0x0C7F) scriptCounts.Telugu++;
    else if (code >= 0x0A80 && code <= 0x0AFF) scriptCounts.Gujarati++;
    else if (code >= 0x0C80 && code <= 0x0CFF) scriptCounts.Kannada++;
    else if (code >= 0x0D00 && code <= 0x0D7F) scriptCounts.Malayalam++;
    else if (code >= 0x0A00 && code <= 0x0A7F) scriptCounts.Gurmukhi++;
    else if (code >= 0x0600 && code <= 0x06FF) scriptCounts.Arabic++;
    else if ((code >= 0x0041 && code <= 0x005A) || (code >= 0x0061 && code <= 0x007A)) scriptCounts.Latin++;
  }

  let dominantScript: ScriptName = 'Latin';
  let maxCount = 0;

  for (const [script, count] of Object.entries(scriptCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantScript = script as ScriptName;
    }
  }

  return dominantScript;
}

/**
 * Detects the likely language ISO code from text based on Unicode character clusters.
 */
export function detectLanguageFromText(text: string): string {
  const script = detectScript(text);
  switch (script) {
    case 'Odia':
      return 'or';
    case 'Bengali':
      return 'bn';
    case 'Tamil':
      return 'ta';
    case 'Telugu':
      return 'te';
    case 'Gujarati':
      return 'gu';
    case 'Kannada':
      return 'kn';
    case 'Malayalam':
      return 'ml';
    case 'Gurmukhi':
      return 'pa';
    case 'Devanagari':
      // Differentiate Marathi from Hindi using characteristic Marathi characters/words
      if (/(ळ|आणि|आहे|नाही|झाले|केले)/.test(text.slice(0, 500))) {
        return 'mr';
      }
      return 'hi';
    default:
      return 'en';
  }
}

/**
 * Splits a word into true grapheme clusters.
 * In Indic scripts, an akshara (base consonant + virama + conjunct consonant + matra)
 * MUST remain a single grapheme unit. Splitting by char causes dotted circles (◌) and broken conjuncts.
 */
export function splitGraphemes(word: string, langCode?: string): string[] {
  if (!word) return [];

  // 1. Modern browser standard: Intl.Segmenter
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new Intl.Segmenter(langCode || 'und', { granularity: 'grapheme' });
      const segments = Array.from(segmenter.segment(word));
      return segments.map(s => s.segment);
    } catch {
      // Fallback below if segmenter fails with given locale
    }
  }

  // 2. Safe Regex fallback combining base characters with combining marks (\p{M})
  // and Zero Width Joiners for legacy browsers
  try {
    const matches = word.match(/[\P{M}][\p{M}\u200c\u200d]*/gu);
    if (matches && matches.length > 0) {
      return matches;
    }
  } catch {
    // If unicode property escapes aren't supported
  }

  // 3. Fallback: return whole word as single unit to prevent matra separation
  return [word];
}

export interface TokenItem {
  id: number;
  text: string;
  isSpace: boolean;
  cleanText: string;
  isWord: boolean;
}

/**
 * UNIFIED Tokenizer:
 * Used identically by ReadingContent (visual rendering) and ttsService (audio synthesis).
 * Ignores pure markdown symbols (###, ***, ---) so speech word index aligns 100% with visual words.
 */
export function tokenizeText(text: string): TokenItem[] {
  if (!text) return [];

  // Split on whitespace boundaries
  const rawParts = text.split(/(\s+)/);
  const tokens: TokenItem[] = [];
  let wordIndex = 0;

  for (const part of rawParts) {
    if (!part) continue;

    const isWhitespace = /^\s+$/.test(part);
    if (isWhitespace) {
      tokens.push({
        id: -1,
        text: part,
        isSpace: true,
        cleanText: '',
        isWord: false
      });
      continue;
    }

    // Check if this part is pure markdown punctuation
    const isMarkdownSyntax = /^[#*_~`\-=>|]+$/.test(part.trim());
    if (isMarkdownSyntax) {
      // Treat as punctuation/space so it doesn't count as a spoken word
      tokens.push({
        id: -1,
        text: part,
        isSpace: false,
        cleanText: '',
        isWord: false
      });
      continue;
    }

    // Valid word token
    const clean = part.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'।॥]/g, '').trim();
    tokens.push({
      id: wordIndex,
      text: part,
      isSpace: false,
      cleanText: clean,
      isWord: true
    });
    wordIndex++;
  }

  return tokens;
}

/**
 * Validates text quality to catch corrupted encodings, replacement characters (),
 * or mismatched translation scripts before presenting to user or continuing provider chain.
 */
export function isTextQualityOk(text: string, expectedScript?: ScriptName): boolean {
  if (!text || text.trim().length === 0) return false;

  const sample = text.trim();

  // 1. Check for unicode replacement character
  if (sample.includes('\uFFFD') || sample.includes('')) {
    return false;
  }

  // 2. Check for mojibake / corrupted question mark clusters
  if (/(\?{3,}|\!{3,})/.test(sample)) {
    return false;
  }

  // 3. If an expected script is given, ensure at least 50% of alphabetic characters match it
  if (expectedScript && expectedScript !== 'Latin') {
    const dominant = detectScript(sample);
    if (dominant !== expectedScript) {
      return false;
    }
  }

  return true;
}

/**
 * Speech text sanitizer that removes TTS-unfriendly characters while preserving
 * pronunciation and word counts matching the unified tokenizer.
 */
export function speechSanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[#*_~`]/g, ' ')      // strip markdown formatting characters
    .replace(/\s+/g, ' ')           // normalize spaces
    .trim();
}
