'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReader } from '@/context/ReaderContext';
import { AVAILABLE_FONTS, THEME_PRESETS } from '@/lib/constants';
import { AIProvider, FontFamily, ThemePreset, UserApiConfig } from '@/types';
import { StorageService } from '@/lib/storage';

export default function SettingsPage() {
  const router = useRouter();
  const { profile, updateProfile, resetProfile } = useReader();

  // API Config (BYOK)
  const [apiConfig, setApiConfig] = useState<UserApiConfig>({
    provider: 'server-default',
    useCustomKey: false,
    geminiKey: '',
    openaiKey: '',
    groqKey: '',
    sarvamKey: '',
  });
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    setApiConfig(StorageService.getApiConfig());
  }, []);

  const handleThemeChange = (presetId: ThemePreset) => {
    const preset = THEME_PRESETS.find((t) => t.id === presetId);
    if (preset) {
      updateProfile({
        themePreset: preset.id,
        backgroundColor: preset.bg,
        textColor: preset.text,
      });
    }
  };

  const handleSaveApiConfig = (updates: Partial<UserApiConfig>) => {
    const updated = { ...apiConfig, ...updates };
    setApiConfig(updated);
    StorageService.saveApiConfig(updated);
    setSaveStatus('API settings saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 pb-32">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary font-bold mb-2">
          Settings and Personalization
        </h2>
        <p className="text-sm sm:text-body-md font-body-md text-on-surface-variant">
          Fine-tune your reading profile and AI services. All changes are saved automatically and applied to every document.
        </p>
      </div>

      {/* Live Preview Card */}
      <div className="mb-6 sm:mb-8 bg-surface-container-low rounded-xl p-4 sm:p-6 border-2 border-surface-container-highest shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
          <span className="text-xs sm:text-label-md font-label-md font-bold text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base sm:text-sm">visibility</span>
            Live Reading Preview
          </span>
          <span className="text-xs text-on-surface-variant font-medium">
            {profile.fontFamily} • {profile.fontSize}px • {profile.lineHeight}x
          </span>
        </div>
        <div
          className="p-4 sm:p-6 rounded-lg transition-all duration-200"
          style={{
            backgroundColor: profile.backgroundColor,
            color: profile.textColor,
            fontFamily: profile.fontFamily,
            fontSize: `${profile.fontSize}px`,
            fontWeight: profile.fontWeight,
            lineHeight: profile.lineHeight,
            letterSpacing: `${profile.letterSpacing}em`,
            wordSpacing: `${profile.wordSpacing}em`,
            textAlign: profile.textAlign,
            maxWidth: `${profile.maxCharactersPerLine}ch`,
            margin: '0 auto',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <p>
            Reading is a bridge to knowledge. When text is adjusted to your unique visual comfort, reading becomes effortless, smooth, and enjoyable.
          </p>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Section 1: AI Translation & Simplification Engine (BYOK) */}
        <section className="bg-surface-bright rounded-xl p-5 sm:p-6 md:p-8 border-2 border-surface-container-highest space-y-5 sm:space-y-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg sm:text-headline-md font-headline-md font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">psychology</span>
              AI Engine & API Keys (BYOK)
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">lock</span>
              Zero Leakage Safe
            </span>
          </div>

          <p className="text-xs sm:text-body-md text-on-surface-variant leading-relaxed">
            Choose whether to use our pre-configured server-side AI or bring your own API key. Keys are safely kept server-side and never exposed to the client bundle.
          </p>

          {/* Engine Choice Radios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Option 1: Pre-Provided Default */}
            <button
              type="button"
              onClick={() => handleSaveApiConfig({ useCustomKey: false, provider: 'server-default' })}
              className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between min-h-[100px] touch-target ${
                !apiConfig.useCustomKey
                  ? 'border-primary bg-secondary-container text-on-secondary-container ring-2 ring-primary/20 shadow-sm'
                  : 'border-surface-container-highest bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg text-primary">verified_user</span>
                  Pre-provided Server AI
                </span>
                {!apiConfig.useCustomKey && (
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                )}
              </div>
              <p className="text-xs opacity-80 mt-2">
                Uses our pre-configured backend endpoints. Fully managed, secure, and ready with zero setup.
              </p>
            </button>

            {/* Option 2: Bring Your Own Key */}
            <button
              type="button"
              onClick={() => handleSaveApiConfig({ useCustomKey: true, provider: apiConfig.provider === 'server-default' ? 'gemini' : apiConfig.provider })}
              className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between min-h-[100px] touch-target ${
                apiConfig.useCustomKey
                  ? 'border-primary bg-secondary-container text-on-secondary-container ring-2 ring-primary/20 shadow-sm'
                  : 'border-surface-container-highest bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg text-primary">key</span>
                  Bring Your Own Key (BYOK)
                </span>
                {apiConfig.useCustomKey && (
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                )}
              </div>
              <p className="text-xs opacity-80 mt-2">
                Use your custom Google Gemini, OpenAI, Groq, or Sarvam AI credentials.
              </p>
            </button>
          </div>

          {/* BYOK Custom Key Form */}
          {apiConfig.useCustomKey && (
            <div className="p-4 sm:p-5 bg-surface-container-low rounded-xl border-2 border-surface-container-highest space-y-4 animate-in fade-in zoom-in-95">
              <div>
                <label className="block text-xs sm:text-label-md font-label-md font-bold text-on-surface mb-2">
                  Select AI Provider
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'gemini', name: 'Google Gemini' },
                      { id: 'openai', name: 'OpenAI (GPT-4o)' },
                      { id: 'groq', name: 'Groq (Llama 3)' },
                      { id: 'sarvam', name: 'Sarvam AI' },
                    ] as { id: AIProvider; name: string }[]
                  ).map((prov) => {
                    const isSelected = apiConfig.provider === prov.id;
                    return (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() => handleSaveApiConfig({ provider: prov.id })}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-surface-container-lowest text-on-surface border-outline-variant hover:bg-surface-container'
                        }`}
                      >
                        {prov.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Key Input based on provider */}
              <div>
                <label className="block text-xs sm:text-label-md font-label-md font-bold text-on-surface mb-1.5">
                  {apiConfig.provider === 'gemini' && 'Google Gemini API Key'}
                  {apiConfig.provider === 'openai' && 'OpenAI API Key'}
                  {apiConfig.provider === 'groq' && 'Groq API Key'}
                  {apiConfig.provider === 'sarvam' && 'Sarvam AI Subscription Key'}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={
                      apiConfig.provider === 'gemini'
                        ? apiConfig.geminiKey || ''
                        : apiConfig.provider === 'openai'
                        ? apiConfig.openaiKey || ''
                        : apiConfig.provider === 'groq'
                        ? apiConfig.groqKey || ''
                        : apiConfig.sarvamKey || ''
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (apiConfig.provider === 'gemini') handleSaveApiConfig({ geminiKey: val });
                      else if (apiConfig.provider === 'openai') handleSaveApiConfig({ openaiKey: val });
                      else if (apiConfig.provider === 'groq') handleSaveApiConfig({ groqKey: val });
                      else if (apiConfig.provider === 'sarvam') handleSaveApiConfig({ sarvamKey: val });
                    }}
                    placeholder={`Enter your ${apiConfig.provider.toUpperCase()} API key...`}
                    className="w-full p-3 pr-12 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl text-sm font-mono text-on-background focus:border-primary focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 text-on-surface-variant hover:text-primary p-1"
                    title={showKey ? 'Hide key' : 'Show key'}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showKey ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Your key is securely stored in your local browser storage and only used during API calls.
                </p>
              </div>
            </div>
          )}

          {saveStatus && (
            <div className="p-3 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-base text-primary">check_circle</span>
              {saveStatus}
            </div>
          )}
        </section>

        {/* Section 2: Typography */}
        <section className="bg-surface-bright rounded-xl p-5 sm:p-6 md:p-8 border-2 border-surface-container-highest space-y-5 sm:space-y-6 shadow-sm">
          <h3 className="text-lg sm:text-headline-md font-headline-md font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">text_fields</span>
            Typography & Font
          </h3>

          {/* Font Family */}
          <div>
            <label className="block text-xs sm:text-label-md font-label-md font-bold text-on-surface mb-2">
              Font Family
            </label>
            <select
              value={profile.fontFamily}
              onChange={(e) => updateProfile({ fontFamily: e.target.value as FontFamily })}
              className="w-full p-3.5 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl text-sm sm:text-body-md font-medium text-on-background focus:border-primary focus:ring-0 cursor-pointer touch-target"
            >
              {AVAILABLE_FONTS.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name} — {font.description}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-label-md font-label-md font-bold text-on-surface">
                Font Size
              </label>
              <span className="text-sm sm:text-body-md font-bold text-primary">{profile.fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="32"
              step="1"
              value={profile.fontSize}
              onChange={(e) => updateProfile({ fontSize: parseInt(e.target.value, 10) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-on-surface-variant mt-1">
              <span>14px</span>
              <span>18px (Standard)</span>
              <span>32px</span>
            </div>
          </div>

          {/* Font Weight */}
          <div>
            <label className="block text-xs sm:text-label-md font-label-md font-bold text-on-surface mb-2">
              Contrast Weight
            </label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => updateProfile({ fontWeight: 400 })}
                className={`py-3 px-4 rounded-xl border-2 font-label-md text-xs sm:text-label-md transition-all touch-target ${
                  profile.fontWeight === 400
                    ? 'border-primary bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                    : 'border-surface-container-highest bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                }`}
              >
                Regular (400)
              </button>
              <button
                type="button"
                onClick={() => updateProfile({ fontWeight: 700 })}
                className={`py-3 px-4 rounded-xl border-2 font-label-md text-xs sm:text-label-md transition-all touch-target ${
                  profile.fontWeight === 700
                    ? 'border-primary bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                    : 'border-surface-container-highest bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                }`}
              >
                Bold (700)
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Spacing & Rhythm */}
        <section className="bg-surface-bright rounded-xl p-5 sm:p-6 md:p-8 border-2 border-surface-container-highest space-y-5 sm:space-y-6 shadow-sm">
          <h3 className="text-lg sm:text-headline-md font-headline-md font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">format_line_spacing</span>
            Spacing & Rhythm
          </h3>

          {/* Line Spacing */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-label-md font-label-md font-bold text-on-surface">
                Line Spacing (Leading)
              </label>
              <span className="text-sm sm:text-body-md font-bold text-primary">{profile.lineHeight}x</span>
            </div>
            <input
              type="range"
              min="1.2"
              max="2.4"
              step="0.1"
              value={profile.lineHeight}
              onChange={(e) => updateProfile({ lineHeight: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Letter Spacing */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-label-md font-label-md font-bold text-on-surface">
                Letter Spacing (Tracking)
              </label>
              <span className="text-sm sm:text-body-md font-bold text-primary">{profile.letterSpacing}em</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.12"
              step="0.01"
              value={profile.letterSpacing}
              onChange={(e) => updateProfile({ letterSpacing: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Word Spacing */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-label-md font-label-md font-bold text-on-surface">
                Word Spacing
              </label>
              <span className="text-sm sm:text-body-md font-bold text-primary">{profile.wordSpacing}em</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.40"
              step="0.02"
              value={profile.wordSpacing}
              onChange={(e) => updateProfile({ wordSpacing: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Max Characters Per Line */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-label-md font-label-md font-bold text-on-surface">
                Line Length Cap (CPL)
              </label>
              <span className="text-sm sm:text-body-md font-bold text-primary">{profile.maxCharactersPerLine} chars</span>
            </div>
            <input
              type="range"
              min="45"
              max="85"
              step="5"
              value={profile.maxCharactersPerLine}
              onChange={(e) => updateProfile({ maxCharactersPerLine: parseInt(e.target.value, 10) })}
              className="w-full"
            />
          </div>
        </section>

        {/* Section 4: Colors & Accessibility Tints */}
        <section className="bg-surface-bright rounded-xl p-5 sm:p-6 md:p-8 border-2 border-surface-container-highest space-y-5 sm:space-y-6 shadow-sm">
          <h3 className="text-lg sm:text-headline-md font-headline-md font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">palette</span>
            Color & Glare Reduction
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {THEME_PRESETS.map((t) => {
              const isSelected = profile.themePreset === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemeChange(t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between min-h-[90px] touch-target ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/30 shadow-md'
                      : 'border-surface-container-highest hover:border-outline-variant'
                  }`}
                  style={{ backgroundColor: t.bg, color: t.text }}
                >
                  <span className="font-bold text-sm">{t.name}</span>
                  <span className="text-xs opacity-80 mt-1">{t.description}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 5: Reading Tools & Helpers */}
        <section className="bg-surface-bright rounded-xl p-5 sm:p-6 md:p-8 border-2 border-surface-container-highest space-y-5 sm:space-y-6 shadow-sm">
          <h3 className="text-lg sm:text-headline-md font-headline-md font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">tune</span>
            Reading Assistance Tools
          </h3>

          {/* Reading Focus Ruler Toggle */}
          <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-surface-container-highest gap-4">
            <div>
              <p className="font-label-md text-xs sm:text-label-md font-bold text-on-surface">Digital Reading Ruler</p>
              <p className="text-xs sm:text-body-md text-on-surface-variant mt-0.5">
                Highlight the active line and softly dim surrounding lines to avoid visual crowding.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateProfile({ readingRulerEnabled: !profile.readingRulerEnabled })}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                profile.readingRulerEnabled ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  profile.readingRulerEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Syllable Highlight Toggle */}
          <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-surface-container-highest gap-4">
            <div>
              <p className="font-label-md text-xs sm:text-label-md font-bold text-on-surface">Syllable Breakpoints</p>
              <p className="text-xs sm:text-body-md text-on-surface-variant mt-0.5">
                Insert subtle visual middle-dots (·) inside multi-syllable words to ease phonics decoding.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateProfile({ syllableHighlighting: !profile.syllableHighlighting })}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                profile.syllableHighlighting ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  profile.syllableHighlighting ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Section 6: Calibration & Reset */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.push('/calibrate')}
            className="flex-1 py-3.5 px-6 rounded-full bg-primary text-on-primary font-label-md text-sm sm:text-label-md font-bold hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 shadow-sm touch-target"
          >
            <span className="material-symbols-outlined text-lg">autorenew</span>
            Re-run Calibration Test
          </button>
          <button
            type="button"
            onClick={resetProfile}
            className="py-3.5 px-6 rounded-full bg-surface-container-high text-on-surface font-label-md text-sm sm:text-label-md font-bold hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 touch-target"
          >
            <span className="material-symbols-outlined text-lg">restart_alt</span>
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
