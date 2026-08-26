'use client';

import React, { useMemo, useState } from 'react';
import { DocumentPage, ReadingPreferences, ConfusablePair, TTSState } from '../../types';
import { getFontFamilyCSS } from '../../lib/utils';
import { Info } from 'lucide-react';

export interface ReadingContentProps {
  page: DocumentPage;
  preferences: ReadingPreferences;
  ttsState: TTSState;
  translatedText: string | null;
  onWordClick?: (wordIndex: number, word: string) => void;
}

export const ReadingContent: React.FC<ReadingContentProps> = ({
  page,
  preferences,
  ttsState,
  translatedText,
  onWordClick
}) => {
  const [selectedTerm, setSelectedTerm] = useState<{ term: string; definition: string } | null>(null);

  // Content to render (either translated or original text paragraphs)
  const rawText = translatedText || page.content;
  const paragraphs = useMemo(() => {
    return rawText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  }, [rawText]);

  // Tokenize words with global indices for synchronized speech tracking
  const tokenizedParagraphs = useMemo(() => {
    let globalWordIndex = 0;

    return paragraphs.map((paraText, pIdx) => {
      const words = paraText.split(/(\s+)/);
      const elements: Array<{ isSpace: boolean; text: string; wordIndex?: number }> = [];

      words.forEach(chunk => {
        if (/^\s+$/.test(chunk)) {
          elements.push({ isSpace: true, text: chunk });
        } else if (chunk.length > 0) {
          elements.push({ isSpace: false, text: chunk, wordIndex: globalWordIndex });
          globalWordIndex++;
        }
      });

      return { pIdx, elements };
    });
  }, [paragraphs]);

  // Confusable letters renderer helper
  const renderConfusableCharacters = (word: string) => {
    if (!preferences.confusableLetterSettings.enabled) {
      return word;
    }

    const { activePairs, style } = preferences.confusableLetterSettings;
    const chars = Array.from(word);

    return chars.map((char, cIdx) => {
      const lower = char.toLowerCase();
      let isConfusable = false;

      if (activePairs.includes('b/d') && (lower === 'b' || lower === 'd')) {
        isConfusable = true;
      } else if (activePairs.includes('p/q') && (lower === 'p' || lower === 'q')) {
        isConfusable = true;
      } else if (activePairs.includes('m/w') && (lower === 'm' || lower === 'w')) {
        isConfusable = true;
      } else if (activePairs.includes('n/u') && (lower === 'n' || lower === 'u')) {
        isConfusable = true;
      }

      if (!isConfusable) return char;

      if (style === 'weight') {
        return (
          <span 
            key={cIdx} 
            className={`font-black ${lower === 'b' || lower === 'p' || lower === 'm' ? 'text-[#B45309]' : 'text-[#047857]'}`}
            title={`Confusable letter: ${char}`}
          >
            {char}
          </span>
        );
      } else if (style === 'subtle-color') {
        return (
          <span 
            key={cIdx} 
            className={`px-0.5 rounded ${lower === 'b' || lower === 'p' || lower === 'm' ? 'bg-[#FED7AA]/50 text-[#9A3412]' : 'bg-[#BBF7D0]/50 text-[#166534]'}`}
          >
            {char}
          </span>
        );
      } else if (style === 'underline') {
        return (
          <span 
            key={cIdx} 
            className="underline decoration-2 decoration-[#D97706] font-bold"
          >
            {char}
          </span>
        );
      } else {
        // Under-dot style
        return (
          <span key={cIdx} className="relative inline-block font-semibold">
            {char}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D97706] rounded-full" />
          </span>
        );
      }
    });
  };

  // Bionic fixation helper
  const formatWordContent = (word: string) => {
    if (preferences.bionicReading && word.length > 2) {
      const mid = Math.ceil(word.length / 2);
      const head = word.slice(0, mid);
      const tail = word.slice(mid);
      return (
        <>
          <span className="font-extrabold">{renderConfusableCharacters(head)}</span>
          <span>{renderConfusableCharacters(tail)}</span>
        </>
      );
    }
    return renderConfusableCharacters(word);
  };

  const fontFamily = getFontFamilyCSS(preferences.font);

  return (
    <div
      id="reading-canvas-area"
      className="w-full transition-colors relative"
      style={{
        backgroundColor: preferences.backgroundColor,
        color: preferences.textColor,
        fontFamily: fontFamily,
        fontSize: `${preferences.fontSize}px`,
        fontWeight: preferences.boldness,
        letterSpacing: `${preferences.letterSpacing}em`,
        wordSpacing: `${preferences.wordSpacing}em`,
        lineHeight: preferences.lineSpacing,
        textAlign: preferences.alignment
      }}
    >
      <div 
        className="mx-auto space-y-6 transition-all"
        style={{
          maxWidth: `${preferences.textWidth}ch`
        }}
      >
        {tokenizedParagraphs.map(({ pIdx, elements }) => (
          <p
            key={pIdx}
            className="transition-all rounded-lg p-1.5 -m-1.5"
            style={{
              marginBottom: `${preferences.paragraphSpacing}rem`
            }}
          >
            {elements.map((elem, eIdx) => {
              if (elem.isSpace) {
                return <span key={eIdx}>{elem.text}</span>;
              }

              const wordIdx = elem.wordIndex ?? -1;
              const isCurrentSpokenWord = ttsState.isPlaying && ttsState.currentWordIndex === wordIdx;
              const isCurrentSpokenPhrase = ttsState.isPlaying && 
                preferences.highlightMode === 'phrase' && 
                wordIdx >= ttsState.currentWordIndex - 2 && 
                wordIdx <= ttsState.currentWordIndex + 2;

              let highlightClass = '';
              if (isCurrentSpokenWord && preferences.highlightMode === 'word') {
                highlightClass = 'rounded-md shadow-xs px-1 -mx-0.5 font-bold transition-all scale-105 inline-block';
              } else if (isCurrentSpokenPhrase) {
                highlightClass = 'rounded-xs px-0.5 bg-[#FDE047]/60';
              }

              return (
                <span
                  key={eIdx}
                  id={`word-span-${wordIdx}`}
                  onClick={() => onWordClick && onWordClick(wordIdx, elem.text)}
                  className={`cursor-pointer transition-colors duration-100 ${highlightClass}`}
                  style={{
                    backgroundColor: isCurrentSpokenWord && preferences.highlightMode === 'word' 
                      ? preferences.highlightColor 
                      : undefined,
                    color: isCurrentSpokenWord && preferences.highlightMode === 'word' 
                      ? '#111827' 
                      : undefined
                  }}
                  title="Click to start speech from this word"
                >
                  {formatWordContent(elem.text)}
                </span>
              );
            })}
          </p>
        ))}

        {/* Key Educational Terms Glossary in Reader */}
        {page.keyTerms && page.keyTerms.length > 0 && !translatedText && (
          <div className="mt-10 pt-6 border-t border-[#D8CEB9]/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#706655] mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#D97706]" />
              Key Concepts & Definitions:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.keyTerms.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTerm(item)}
                  className="p-3 rounded-xl bg-[#FAF3E0]/70 border border-[#E7DFCA] hover:border-[#D97706] cursor-pointer transition-all"
                >
                  <p className="text-xs font-bold text-[#1E1B18] flex items-center justify-between">
                    <span>{item.term}</span>
                    <span className="text-[10px] text-[#D97706] font-normal">tap to view</span>
                  </p>
                  <p className="text-[11px] text-[#524B40] mt-0.5 line-clamp-2">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Term definition floating mini-card */}
      {selectedTerm && (
        <div 
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 p-4 bg-[#FEF9EB] border border-[#D97706] rounded-2xl shadow-xl max-w-sm w-[90%] text-[#26231E] animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="flex items-center justify-between gap-2 border-b border-[#E7DFCA] pb-2 mb-2">
            <span className="font-bold text-sm text-[#1E1B18]">{selectedTerm.term}</span>
            <button
              onClick={() => setSelectedTerm(null)}
              className="text-xs text-[#706655] hover:text-[#1E1B18] px-1.5 py-0.5 rounded bg-[#FAF3E0]"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-[#524B40] leading-relaxed">
            {selectedTerm.definition}
          </p>
        </div>
      )}
    </div>
  );
};
