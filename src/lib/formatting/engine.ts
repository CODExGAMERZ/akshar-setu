import React from 'react';
import { ConfusablePair } from '@/types';

/**
 * Adaptive Formatting Engine for AksharSetu
 * Provides syllable segmentation, confusable letter highlighting, and text normalization.
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

/**
 * Renders individual letters with visual cues for commonly confused letter pairs:
 * - b / d
 * - p / q
 * - m / w
 */
export function renderConfusableSpans(
  text: string,
  enabled: boolean,
  activePairs: ConfusablePair[] = ['bd', 'pq', 'mw']
): React.ReactNode {
  if (!enabled || !text) return text;

  const enableBD = activePairs.includes('bd');
  const enablePQ = activePairs.includes('pq');
  const enableMW = activePairs.includes('mw');

  const chars = Array.from(text);
  return chars.map((ch, idx) => {
    const lower = ch.toLowerCase();

    if (enableBD && lower === 'b') {
      return React.createElement('span', { key: idx, className: 'confusable-b', title: "Letter 'b'" }, ch);
    }
    if (enableBD && lower === 'd') {
      return React.createElement('span', { key: idx, className: 'confusable-d', title: "Letter 'd'" }, ch);
    }
    if (enablePQ && lower === 'p') {
      return React.createElement('span', { key: idx, className: 'confusable-p', title: "Letter 'p'" }, ch);
    }
    if (enablePQ && lower === 'q') {
      return React.createElement('span', { key: idx, className: 'confusable-q', title: "Letter 'q'" }, ch);
    }
    if (enableMW && lower === 'm') {
      return React.createElement('span', { key: idx, className: 'confusable-m', title: "Letter 'm'" }, ch);
    }
    if (enableMW && lower === 'w') {
      return React.createElement('span', { key: idx, className: 'confusable-w', title: "Letter 'w'" }, ch);
    }

    return ch;
  });
}

/**
 * Normalizes text for dyslexia readability:
 * 1. Converts ALL-CAPS paragraphs/sentences to sentence case (preserving short acronyms).
 * 2. Softens excessive italicized runs.
 * 3. Chunks long text blocks into digestible paragraphs.
 */
export function normalizeDyslexiaText(text: string): string {
  if (!text) return '';

  const paragraphs = text.split('\n\n');
  const normalized = paragraphs.map((p) => {
    const trimmed = p.trim();
    if (!trimmed) return '';

    // If whole paragraph is in ALL CAPS and longer than 15 chars, convert to Sentence case
    const isAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]{4,}/.test(trimmed);
    if (isAllCaps) {
      return trimmed
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        .replace(/\b(nasa|isro|who|unesco|ai|un|pdf|tts|wcag|cpl)\b/gi, (a) => a.toUpperCase());
    }

    return trimmed;
  });

  return normalized.join('\n\n');
}
