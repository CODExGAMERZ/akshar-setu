'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReader } from '@/context/ReaderContext';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import { SupportedLanguage } from '@/types';

export default function LanguagePage() {
  const router = useRouter();
  const { activeLanguage, setLanguage, currentDocument } = useReader();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSelectLanguage = async (code: SupportedLanguage) => {
    setIsSwitching(true);
    await setLanguage(code);
    setIsSwitching(false);
    if (currentDocument) {
      router.push(`/read/${currentDocument.id}`);
    } else {
      router.push('/upload');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 md:pt-12 pb-32">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary font-bold mb-2">
          Select Language
        </h2>
        <p className="text-sm sm:text-body-md font-body-md text-on-surface-variant leading-relaxed">
          Switching language keeps all personalization settings and history intact, and switches Read Aloud to a matching voice automatically.
        </p>
      </div>

      {isSwitching && (
        <div className="mb-6 p-4 rounded-xl bg-secondary-container text-on-secondary-container font-bold flex items-center gap-3 animate-pulse">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          Adapting text and voices to selected language...
        </div>
      )}

      {/* Language Grid (Adaptive on all screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = activeLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelectLanguage(lang.code)}
              className={`w-full text-left bg-surface-container-lowest rounded-xl p-5 sm:p-6 transition-all min-h-touch-target flex items-center justify-between group shadow-sm active:scale-[0.99] touch-target ${
                isSelected
                  ? 'border-2 border-primary ring-2 ring-primary/20 bg-surface-container-low'
                  : 'border border-outline-variant hover:bg-surface-container-low hover:border-outline'
              }`}
            >
              <div>
                <p className="text-lg sm:text-headline-md font-headline-md font-bold text-on-surface mb-0.5 sm:mb-1">
                  {lang.nativeName}
                </p>
                <p className="text-xs sm:text-body-md font-body-md text-on-surface-variant">
                  {lang.name}
                </p>
              </div>

              {isSelected && (
                <span
                  className="material-symbols-outlined text-primary text-2xl sm:text-3xl opacity-100 group-hover:scale-110 transition-transform"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
