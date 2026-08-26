'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CALIBRATION_ROUNDS } from '../../data/calibrationData';
import { CalibrationCard } from './CalibrationCard';
import { CalibrationSummary } from './CalibrationSummary';
import { Button } from '../common/Button';
import { calibrationService } from '../../services/calibrationService';
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { ReadingPreferences } from '../../types';

export const CalibrationView: React.FC = () => {
  const { preferences, applyCalibrationResult, navigateToReader, documents, setCurrentRoute } = useApp();
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: 'font_lexend',
    2: 'spacing_balanced',
    3: 'theme_warm_cream',
    4: 'highlight_word',
    5: 'calibrated_choice'
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [calibratedResult, setCalibratedResult] = useState<ReadingPreferences | null>(null);

  const currentRound = CALIBRATION_ROUNDS[currentRoundIndex];
  const totalRounds = CALIBRATION_ROUNDS.length;

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentRound.id]: optionId
    }));
  };

  const handleNextRound = () => {
    if (currentRoundIndex < totalRounds - 1) {
      setCurrentRoundIndex(prev => prev + 1);
    } else {
      // Synthesize calibrated result
      const generated = calibrationService.synthesizePreferences(answers);
      setCalibratedResult(generated);
      setIsCompleted(true);
    }
  };

  const handlePrevRound = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(prev => prev - 1);
    }
  };

  const handleApply = async () => {
    if (calibratedResult) {
      await applyCalibrationResult({
        roundSelections: answers,
        generatedPreferences: calibratedResult,
        completedAt: new Date().toISOString()
      });
    }
  };

  const handleOpenReader = () => {
    if (documents.length > 0) {
      navigateToReader(documents[0].id);
    } else {
      setCurrentRoute('library');
    }
  };

  const handleRedo = () => {
    setIsCompleted(false);
    setCurrentRoundIndex(0);
  };

  if (isCompleted && calibratedResult) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CalibrationSummary
          preferences={calibratedResult}
          onApply={handleApply}
          onRedo={handleRedo}
          onOpenReader={handleOpenReader}
        />
      </div>
    );
  }

  const currentSelectedOptionId = answers[currentRound.id];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Progress */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF1DA] border border-[#E4D5AD] text-xs font-semibold text-[#8C6D23]">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          Step {currentRoundIndex + 1} of {totalRounds}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B18]">
          {currentRound.title}
        </h2>

        <p className="text-sm text-[#706655] leading-relaxed">
          {currentRound.subtitle}
        </p>

        {/* Visual Progress Bar */}
        <div className="w-full bg-[#E7DFCA] h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#D97706] h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentRoundIndex + 1) / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* Calibration Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentRound.options.map(option => (
          <CalibrationCard
            key={option.id}
            option={option}
            isSelected={currentSelectedOptionId === option.id}
            sampleText={currentRound.sampleText}
            basePreferences={preferences}
            onSelect={() => handleSelectOption(option.id)}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E7DFCA]">
        <Button
          variant="outline"
          onClick={handlePrevRound}
          disabled={currentRoundIndex === 0}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <span className="text-xs text-[#706655] font-medium hidden sm:inline">
          {currentSelectedOptionId ? 'Choice selected — proceed to next step' : 'Select an option to proceed'}
        </span>

        <Button
          variant="primary"
          onClick={handleNextRound}
          icon={currentRoundIndex === totalRounds - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        >
          {currentRoundIndex === totalRounds - 1 ? 'Finish & Generate Profile' : 'Next Step'}
        </Button>
      </div>
    </div>
  );
};
