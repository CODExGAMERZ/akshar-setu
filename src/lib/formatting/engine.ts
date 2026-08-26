/**
 * Adaptive Formatting Engine for AksharSetu
 * Provides clean syllable segmentation and layout utilities
 */

export function segmentWordIntoSyllables(word: string): string[] {
  // Only break words that are at least 5 letters long and purely alphabetic
  const cleanMatch = word.match(/^([^\w]*)([a-zA-Z\u0900-\u0D7F]+)([^\w]*)$/);
  if (!cleanMatch) return [word];

  const prefix = cleanMatch[1] || '';
  const coreWord = cleanMatch[2];
  const suffix = cleanMatch[3] || '';

  if (coreWord.length < 5) {
    return [word];
  }

  // Regex vowel clusters heuristic
  const regex = /[bcdfghjklmnpqrstvwxz]*[aeiouy]+[bcdfghjklmnpqrstvwxz]*/gi;
  const matches: RegExpExecArray[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(coreWord)) !== null) {
    matches.push(m);
  }

  if (matches.length <= 1) {
    return [word];
  }

  const syllables: string[] = [];
  let currentPos = 0;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const matchEnd = (match.index || 0) + match[0].length;
    if (i === matches.length - 1) {
      syllables.push(coreWord.slice(currentPos));
    } else {
      const nextMatch = matches[i + 1];
      const nextIndex = nextMatch.index || matchEnd;
      const splitPoint = Math.floor((matchEnd + nextIndex) / 2);
      syllables.push(coreWord.slice(currentPos, Math.max(splitPoint, currentPos + 1)));
      currentPos = Math.max(splitPoint, currentPos + 1);
    }
  }

  if (syllables.length > 0) {
    syllables[0] = prefix + syllables[0];
    syllables[syllables.length - 1] = syllables[syllables.length - 1] + suffix;
    return syllables;
  }

  return [word];
}

export function formatTextWithSyllables(text: string): string {
  if (!text || text.length < 5) return text;
  const syllables = segmentWordIntoSyllables(text);
  if (syllables.length <= 1) return text;
  return syllables.join('·');
}
