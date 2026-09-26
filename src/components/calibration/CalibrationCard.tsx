'use client';

import React from 'react';
import { CalibrationOption, ReadingPreferences } from '../../types';
import { getFontFamilyCSS } from '../../lib/utils';
import { CheckCircle2 } from 'lucide-react';

export interface CalibrationCardProps {
  option: CalibrationOption;
  isSelected: boolean;
  sampleText: string;
  basePreferences: ReadingPreferences;
  onSelect: () => void;
}

export const CalibrationCard: React.FC<CalibrationCardProps> = ({
  option,
  isSelected,
  sampleText,
  basePreferences,
  onSelect
}) => {
  // Merge base preferences with round preview settings
  const merged: ReadingPreferences = {
    ...basePreferences,
    ...option.previewSettings
  };

  const fontFamily = getFontFamilyCSS(merged.font);

  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 select-none ${
        isSelected
          ? 'border-[#D97706] bg-[#FEF9EB] shadow-md ring-2 ring-[#D97706]/20'
          : 'border-[#E7DFCA] bg-[#FAF3E0] hover:border-[#8C7A5D] hover:bg-[#FEF9EB]/60'
      }`}
    >
      {/* Header Info */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold text-sm text-[#1E1B18]">{option.title}</h4>
          {option.badge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF1DA] text-[#8C6D23] border border-[#E4D5AD]">
              {option.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-[#706655] leading-relaxed">
          {option.description}
        </p>
      </div>

      {/* Live Preview Box */}
      <div
        className="p-5 rounded-xl border transition-all overflow-hidden"
        style={{
          backgroundColor: merged.backgroundColor,
          color: merged.textColor,
          borderColor: isSelected ? '#D97706' : '#E7DFCA',
          fontFamily: fontFamily,
          fontSize: `${merged.fontSize}px`,
          fontWeight: merged.boldness,
          letterSpacing: `${merged.letterSpacing}em`,
          wordSpacing: `${merged.wordSpacing}em`,
          lineHeight: merged.lineSpacing,
          textAlign: merged.alignment
        }}
      >
        <div 
          className="line-clamp-3"
          style={{
            maxWidth: merged.textWidth ? `${merged.textWidth}ch` : undefined
          }}
        >
          {(() => {
            if (!merged.confusableLetterSettings?.enabled) {
              return sampleText;
            }
            const { activePairs, style } = merged.confusableLetterSettings;
            return sampleText.split(/(\s+)/).map((chunk, idx) => {
              if (/^\s+$/.test(chunk)) return chunk;
              return (
                <span key={idx}>
                  {Array.from(chunk).map((char, cIdx) => {
                    const lower = char.toLowerCase();
                    let isConfusable = false;
                    if (activePairs.includes('b/d') && (lower === 'b' || lower === 'd')) isConfusable = true;
                    else if (activePairs.includes('p/q') && (lower === 'p' || lower === 'q')) isConfusable = true;
                    else if (activePairs.includes('m/w') && (lower === 'm' || lower === 'w')) isConfusable = true;
                    else if (activePairs.includes('n/u') && (lower === 'n' || lower === 'u')) isConfusable = true;
                    else if (activePairs.includes('s/z') && (lower === 's' || lower === 'z')) isConfusable = true;

                    if (!isConfusable) return char;
                    const isFirstOfPair = lower === 'b' || lower === 'p' || lower === 'm' || lower === 'n' || lower === 's';

                    if (style === 'weight') {
                      return (
                        <span key={cIdx} className={`font-black ${isFirstOfPair ? 'text-[#B45309]' : 'text-[#047857]'}`}>
                          {char}
                        </span>
                      );
                    } else if (style === 'subtle-color') {
                      return (
                        <span key={cIdx} className={`px-0.5 rounded ${isFirstOfPair ? 'bg-[#FED7AA]/60 text-[#9A3412]' : 'bg-[#BBF7D0]/60 text-[#166534]'}`}>
                          {char}
                        </span>
                      );
                    } else if (style === 'underline') {
                      return (
                        <span key={cIdx} className="underline decoration-2 decoration-[#D97706] font-bold">
                          {char}
                        </span>
                      );
                    } else {
                      return (
                        <span key={cIdx} className="border-b border-dotted border-[#D97706] font-semibold">
                          {char}
                        </span>
                      );
                    }
                  })}
                </span>
              );
            });
          })()}
        </div>
      </div>

      {/* Select button state */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-[#706655]">
          {isSelected ? 'Selected' : 'Click to preview'}
        </span>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
          isSelected 
            ? 'bg-[#D97706] border-[#D97706] text-white' 
            : 'border-[#D8CEB9] bg-white'
        }`}>
          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
        </div>
      </div>
    </div>
  );
};
