/**
 * Adaptive Formatting Engine for AksharSetu
 * Provides syllable segmentation, sight word marking, and CSS generation
 */

// Basic syllable segmentation regex heuristics for English and Romanized Indic
const SYLLABLE_VOWELS = /[aeiouyāīūēōaiau]+/gi;

export function segmentWordIntoSyllables(word: string): string[] {
  // Strip punctuation for matching
  const cleanWord = word.replace(/[^\w]/g, '');
  if (cleanWord.length <= 3) return [word];

  // Regex syllable split heuristic
  const syllables: string[] = [];
  let lastIndex = 0;
  
  // Look for vowel-consonant clusters
  const regex = /[bcdfghjklmnpqrstvwxz]*[aeiouy]+[bcdfghjklmnpqrstvwxz]*/gi;
  const matches: RegExpExecArray[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(cleanWord)) !== null) {
    matches.push(m);
  }
  if (matches.length <= 1) return [word];

  let currentPos = 0;
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const matchEnd = (match.index || 0) + match[0].length;
    if (i === matches.length - 1) {
      syllables.push(cleanWord.slice(currentPos));
    } else {
      // Split between current and next vowel
      const nextMatch = matches[i + 1];
      const nextIndex = nextMatch.index || matchEnd;
      const splitPoint = Math.floor((matchEnd + nextIndex) / 2);
      syllables.push(cleanWord.slice(currentPos, Math.max(splitPoint, currentPos + 1)));
      currentPos = Math.max(splitPoint, currentPos + 1);
    }
  }

  return syllables.length > 0 ? syllables : [word];
}

export function formatTextWithSyllables(text: string): string {
  const words = text.split(/(\s+)/);
  return words
    .map((token) => {
      if (/^\s+$/.test(token)) return token;
      const syllables = segmentWordIntoSyllables(token);
      if (syllables.length <= 1) return token;
      return syllables.join('·');
    })
    .join('');
}

export function splitIntoWordsForKaraoke(text: string): { word: string; index: number }[] {
  const rawWords = text.trim().split(/\s+/);
  return rawWords.map((word, index) => ({ word, index }));
}
