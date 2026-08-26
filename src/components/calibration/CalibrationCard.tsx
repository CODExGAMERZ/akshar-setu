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
        <p className="line-clamp-3">
          {sampleText}
        </p>
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
