'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../data/themes';
import { Languages, Loader2 } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeReadingLanguage, isTranslating } = useApp();

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FEF9EB] border border-[#D8CEB9] text-xs font-semibold text-[#26231E]">
        {isTranslating ? (
          <Loader2 className="w-3.5 h-3.5 text-[#D97706] animate-spin" />
        ) : (
          <Languages className="w-3.5 h-3.5 text-[#D97706]" />
        )}
        <select
          id="reader-language-select"
          value={currentLanguage}
          disabled={isTranslating}
          onChange={(e) => changeReadingLanguage(e.target.value)}
          className="bg-transparent text-xs font-bold text-[#1E1B18] focus:outline-none cursor-pointer pr-2 max-w-[100px] sm:max-w-[160px] truncate"
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code} className="bg-[#FEF9EB] text-[#26231E]">
              {lang.name} ({lang.nativeName})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
