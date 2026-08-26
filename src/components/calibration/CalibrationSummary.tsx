'use client';

import React from 'react';
import { ReadingPreferences } from '../../types';
import { Button } from '../common/Button';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight, BookOpen } from 'lucide-react';
import { getFontFamilyCSS } from '../../lib/utils';

export interface CalibrationSummaryProps {
  preferences: ReadingPreferences;
  onApply: () => Promise<void>;
  onRedo: () => void;
  onOpenReader: () => void;
}

export const CalibrationSummary: React.FC<CalibrationSummaryProps> = ({
  preferences,
  onApply,
  onRedo,
  onOpenReader
}) => {
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSaveAndApply = async () => {
    await onApply();
    setIsSaved(true);
  };

  const fontFamily = getFontFamilyCSS(preferences.font);

  return (
    <div className="bg-[#FAF3E0] border border-[#E7DFCA] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 max-w-4xl mx-auto text-[#26231E]">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#EDF5EC] text-[#047857] flex items-center justify-center mx-auto border border-[#CBDBCB]">
          <Sparkles className="w-7 h-7" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B18]">
          Your Calibrated Reading Profile is Ready!
        </h2>

        <p className="text-xs sm:text-sm text-[#706655] max-w-xl mx-auto leading-relaxed">
          Based on your choices, we engineered your personalized optical settings to minimize eye fatigue, letter inversion, and visual glare.
        </p>
      </div>

      {/* Live Calibrated Text Showcase Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#706655] px-1">
          <span className="font-bold uppercase tracking-wider">Live Calibrated Environment Preview:</span>
          <span>Theme: {preferences.themeId}</span>
        </div>

        <div
          className="p-8 rounded-2xl border border-[#E7DFCA] shadow-2xs transition-all"
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
          <p className="mb-4">
            &ldquo;In the heart of the ancient redwood forest, gentle morning mist gathers on delicate leaves, nourishing wildflowers and clear mountain streams.&rdquo;
          </p>
          <p>
            Notice how the letter shapes breathe naturally and the warm ivory background stops ocular fatigue during long study sessions.
          </p>
        </div>
      </div>

      {/* Extracted Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#706655]">Font Family</span>
          <p className="font-bold text-sm text-[#1E1B18] truncate">{preferences.font}</p>
        </div>

        <div className="p-4 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#706655]">Line Height</span>
          <p className="font-bold text-sm text-[#1E1B18]">{preferences.lineSpacing}x</p>
        </div>

        <div className="p-4 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#706655]">Guidance</span>
          <p className="font-bold text-sm text-[#1E1B18] capitalize">{preferences.highlightMode}</p>
        </div>

        <div className="p-4 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#706655]">Contrast</span>
          <p className="font-bold text-sm text-[#1E1B18]">Warm Ivory</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E7DFCA]">
        <Button
          variant="outline"
          size="md"
          icon={<RotateCcw className="w-4 h-4" />}
          onClick={onRedo}
        >
          Retake Calibration
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            icon={<CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
            onClick={handleSaveAndApply}
          >
            {isSaved ? 'Applied to Profile ✓' : 'Save & Apply to Profile'}
          </Button>

          <Button
            variant="accent"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={onOpenReader}
          >
            Open Reader
          </Button>
        </div>
      </div>
    </div>
  );
};
