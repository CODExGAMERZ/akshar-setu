'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CALIBRATION_STEPS, CalibrationChoice, computeCalibratedProfile } from '@/lib/calibration/engine';
import { useReader } from '@/context/ReaderContext';
import { useAuth } from '@/context/AuthContext';

export default function CalibrationPage() {
  const router = useRouter();
  const { profile, updateProfile } = useReader();
  const { setIsProfileReadyModalOpen } = useAuth();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [choices, setChoices] = useState<CalibrationChoice[]>([]);

  const currentStep = CALIBRATION_STEPS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / CALIBRATION_STEPS.length) * 100);

  const handleChoice = (choice: 'A' | 'B' | 'SAME') => {
    const newChoices = [...choices, { stepId: currentStep.id, choice }];
    setChoices(newChoices);

    if (currentStepIndex + 1 < CALIBRATION_STEPS.length) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Completed all 10 steps!
      const calibrated = computeCalibratedProfile(newChoices, profile);
      updateProfile(calibrated);
      setIsProfileReadyModalOpen(true);
    }
  };

  return (
    <div className="bg-background text-on-background antialiased min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6 md:p-margin-desktop py-8 sm:py-12 w-full max-w-5xl mx-auto">
      {/* Progress Indicator */}
      <div className="w-full max-w-4xl mb-6 sm:mb-stack-gap text-center md:text-left">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs sm:text-label-md font-label-md text-on-surface-variant font-bold">
            Question {currentStepIndex + 1} of {CALIBRATION_STEPS.length}
          </p>
          <span className="text-xs font-bold text-primary">{progressPercent}%</span>
        </div>
        <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <h1 className="text-headline-lg-mobile font-headline-lg-mobile md:text-headline-lg md:font-headline-lg mt-4 sm:mt-6 text-primary font-bold">
          Which text feels easier to read?
        </h1>
        <p className="text-sm sm:text-body-md font-body-md text-on-surface-variant mt-1 sm:mt-2">
          {currentStep.description} Take your time. There is no wrong answer.
        </p>
      </div>

      {/* Comparison Cards (Responsive on Mobile, Tablet & Desktop) */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 sm:gap-gutter mb-6 sm:mb-stack-gap">
        {/* Sample A */}
        <div
          onClick={() => handleChoice('A')}
          className="flex-1 bg-surface-container-low rounded-xl p-5 sm:p-6 md:p-8 border-2 border-surface-container-highest hover:border-primary active:scale-[0.99] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center mb-3 sm:mb-4 gap-2">
            <span className="material-symbols-outlined text-primary">{currentStep.sampleA.icon}</span>
            <h2 className="text-lg sm:text-headline-md font-headline-md text-primary font-bold">
              {currentStep.sampleA.label}
            </h2>
          </div>
          <p
            className="text-base sm:text-body-lg font-body-lg text-on-surface text-left"
            style={{
              fontFamily: currentStep.sampleA.style.fontFamily || profile.fontFamily,
              fontSize: currentStep.sampleA.style.fontSize ? `${currentStep.sampleA.style.fontSize}px` : `${profile.fontSize}px`,
              lineHeight: currentStep.sampleA.style.lineHeight || profile.lineHeight,
              letterSpacing: currentStep.sampleA.style.letterSpacing ? `${currentStep.sampleA.style.letterSpacing}em` : `${profile.letterSpacing}em`,
              wordSpacing: currentStep.sampleA.style.wordSpacing ? `${currentStep.sampleA.style.wordSpacing}em` : `${profile.wordSpacing}em`,
              fontWeight: currentStep.sampleA.style.fontWeight || profile.fontWeight,
              backgroundColor: currentStep.sampleA.style.backgroundColor || 'transparent',
              color: currentStep.sampleA.style.textColor || profile.textColor,
              maxWidth: currentStep.sampleA.style.maxCharactersPerLine ? `${currentStep.sampleA.style.maxCharactersPerLine}ch` : '100%',
              padding: currentStep.sampleA.style.backgroundColor ? '0.75rem' : '0',
              borderRadius: '0.5rem',
            }}
          >
            {currentStep.sampleA.text}
          </p>
        </div>

        {/* Sample B */}
        <div
          onClick={() => handleChoice('B')}
          className="flex-1 bg-surface-container-low rounded-xl p-5 sm:p-6 md:p-8 border-2 border-surface-container-highest hover:border-primary active:scale-[0.99] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center mb-3 sm:mb-4 gap-2">
            <span className="material-symbols-outlined text-primary">{currentStep.sampleB.icon}</span>
            <h2 className="text-lg sm:text-headline-md font-headline-md text-primary font-bold">
              {currentStep.sampleB.label}
            </h2>
          </div>
          <p
            className="text-base sm:text-body-lg font-body-lg text-on-surface text-left"
            style={{
              fontFamily: currentStep.sampleB.style.fontFamily || profile.fontFamily,
              fontSize: currentStep.sampleB.style.fontSize ? `${currentStep.sampleB.style.fontSize}px` : `${profile.fontSize}px`,
              lineHeight: currentStep.sampleB.style.lineHeight || profile.lineHeight,
              letterSpacing: currentStep.sampleB.style.letterSpacing ? `${currentStep.sampleB.style.letterSpacing}em` : `${profile.letterSpacing}em`,
              wordSpacing: currentStep.sampleB.style.wordSpacing ? `${currentStep.sampleB.style.wordSpacing}em` : `${profile.wordSpacing}em`,
              fontWeight: currentStep.sampleB.style.fontWeight || profile.fontWeight,
              backgroundColor: currentStep.sampleB.style.backgroundColor || 'transparent',
              color: currentStep.sampleB.style.textColor || profile.textColor,
              maxWidth: currentStep.sampleB.style.maxCharactersPerLine ? `${currentStep.sampleB.style.maxCharactersPerLine}ch` : '100%',
              padding: currentStep.sampleB.style.backgroundColor ? '0.75rem' : '0',
              borderRadius: '0.5rem',
            }}
          >
            {currentStep.sampleB.text}
          </p>
        </div>
      </div>

      {/* Action Buttons (Touch-friendly & Stacked on Mobile) */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-3">
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => handleChoice('A')}
            className="flex-1 min-h-[3.25rem] bg-primary text-on-primary rounded-full px-6 py-3 text-sm sm:text-label-md font-label-md hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95 touch-target"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            A feels easier
          </button>
          <button
            type="button"
            onClick={() => handleChoice('B')}
            className="flex-1 min-h-[3.25rem] bg-primary text-on-primary rounded-full px-6 py-3 text-sm sm:text-label-md font-label-md hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95 touch-target"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            B feels easier
          </button>
        </div>
        <button
          type="button"
          onClick={() => handleChoice('SAME')}
          className="w-full sm:w-auto min-h-[3rem] bg-surface-container-high text-on-surface rounded-full px-8 py-3 text-sm sm:text-label-md font-label-md hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 font-bold active:scale-95 touch-target"
        >
          <span className="material-symbols-outlined text-lg">drag_handle</span>
          They feel the same
        </button>
      </div>
    </div>
  );
}
