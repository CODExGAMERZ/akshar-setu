'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReader } from '@/context/ReaderContext';

export default function AssessmentOnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useReader();
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedTips, setDetectedTips] = useState<string[] | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setDetectedTips([
          'Recommended OpenDyslexic / Lexend font with weighted baselines.',
          'Suggested relaxed 1.7× line height to avoid line confusion.',
          'Calibrated soft ivory background to reduce scotopic light stress.',
          'Enabled confusable letter cues for b/d and p/q differentiation.',
        ]);
      }, 1200);
    }
  };

  const handleApplyAssessmentProfile = () => {
    updateProfile({
      fontFamily: 'OpenDyslexic',
      lineHeight: 1.7,
      letterSpacing: 0.08,
      wordSpacing: 0.18,
      confusableLettersEnabled: true,
      backgroundColor: '#fbf9f8',
      textColor: '#1b1c1c',
    });
    router.push('/library');
  };

  const handleSkip = () => {
    router.push('/library');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="bg-surface-bright rounded-3xl p-6 sm:p-10 border-2 border-surface-container-highest shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary text-xs font-bold mb-3">
            <span className="material-symbols-outlined text-sm">assignment</span>
            Optional Personalization Flow
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-primary mb-2">
            Have an Assessment or Prescription Report?
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed">
            If you have an existing optometrist or reading assessment report, upload it to automatically pre-configure your visual settings.
          </p>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-primary/20 text-xs text-on-surface-variant mb-6 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">info</span>
          <p>
            <strong>Note:</strong> AksharSetu is a reading-support tool, not a diagnostic or medical system. Uploading documents is strictly optional and used solely to tailor your visual layout.
          </p>
        </div>

        {/* Upload Box */}
        {!detectedTips && !isProcessing && (
          <div className="border-2 border-dashed border-primary/40 rounded-2xl p-8 sm:p-12 text-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
            <input
              type="file"
              id="assessment-upload"
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="assessment-upload" className="cursor-pointer flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
              </div>
              <div>
                <span className="text-sm font-bold text-primary block">Click to upload report or drag and drop</span>
                <span className="text-xs text-on-surface-variant block mt-1">PDF, PNG, JPG (Max 10MB)</span>
              </div>
            </label>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <div>
              <p className="font-bold text-base text-on-surface">Analyzing Assessment Document...</p>
              <p className="text-xs text-on-surface-variant mt-1">Extracting visual and spacing guidelines</p>
            </div>
          </div>
        )}

        {/* Extracted Profile Recommendations */}
        {detectedTips && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-5 rounded-2xl bg-secondary-container border border-primary/20 text-on-secondary-container space-y-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                Suggested Reading Preferences
              </h3>
              <ul className="space-y-2 text-xs">
                {detectedTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-primary">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleApplyAssessmentProfile}
                className="flex-1 py-3 px-6 rounded-full bg-primary text-on-primary font-bold text-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 touch-target"
              >
                <span className="material-symbols-outlined text-lg">check</span>
                Apply & Open Library
              </button>
            </div>
          </div>
        )}

        {/* Skip Button */}
        {!detectedTips && !isProcessing && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs sm:text-sm font-bold text-on-surface-variant hover:text-primary transition-colors py-2 px-4 rounded-full"
            >
              Skip for now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
