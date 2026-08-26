'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReader } from '@/context/ReaderContext';
import { AVAILABLE_FONTS, SUPPORTED_LANGUAGES, THEME_PRESETS } from '@/lib/constants';
import { ConfusablePair, FontFamily, HighlightMode, SupportedLanguage, ThemePreset } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const {
    profile,
    updateProfile,
    resetProfile,
    saveAsGlobalSettings,
    confusableLettersEnabled,
    setConfusableLettersEnabled,
    confusablePairs,
    toggleConfusablePair,
    highlightMode,
    setHighlightMode,
  } = useReader();

  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const handleThemePresetChange = (presetId: ThemePreset) => {
    const preset = THEME_PRESETS.find((t) => t.id === presetId);
    if (preset) {
      updateProfile({
        themePreset: preset.id,
        backgroundColor: preset.bg,
        textColor: preset.text,
        highlightColor: preset.highlight,
      });
    }
  };

  const handleApplyWcagPreset = () => {
    updateProfile({
      fontSize: Math.max(profile.fontSize, 18),
      lineHeight: 1.6,
      letterSpacing: 0.12, // WCAG 0.12em
      wordSpacing: 0.16, // WCAG 0.16em
      maxCharactersPerLine: 65,
    });
    setSaveBanner('WCAG AAA Spacing preset applied successfully!');
    setTimeout(() => setSaveBanner(null), 3000);
  };

  const handleSave = () => {
    saveAsGlobalSettings();
    setSaveBanner('Your reading profile has been saved globally.');
    setTimeout(() => setSaveBanner(null), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-primary mb-1">
            Reading Profile & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Your reading environment should adapt to you. Fine-tune your typographic, color, and focus preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleApplyWcagPreset}
          className="px-4 py-2.5 rounded-full bg-secondary-container text-on-secondary-container border border-primary/30 font-bold text-xs hover:bg-primary/20 transition-colors flex items-center gap-1.5 self-start sm:self-auto touch-target"
        >
          <span className="material-symbols-outlined text-sm text-primary">auto_fix_high</span>
          Apply WCAG 2.1 Preset
        </button>
      </div>

      {saveBanner && (
        <div className="mb-6 p-4 rounded-xl bg-secondary-container text-on-secondary-container border border-primary/30 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          {saveBanner}
        </div>
      )}

      {/* Live Preview Canvas Card */}
      <div className="mb-8 bg-surface-bright rounded-2xl p-5 sm:p-6 border-2 border-surface-container-highest shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">visibility</span>
            Live Reading Preview
          </span>
          <span className="text-[11px] text-on-surface-variant font-medium">
            {profile.fontFamily} • {profile.fontSize}px • {profile.lineHeight}× leading • {profile.maxCharactersPerLine}ch width
          </span>
        </div>

        <div
          className="p-5 sm:p-7 rounded-xl transition-all duration-200"
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
          <h2 className="font-bold text-primary mb-2 text-xl border-b border-primary/20 pb-1">
            Class 8 Science: Solar Dynamics
          </h2>
          <p>
            {confusableLettersEnabled ? (
              <span>
                <span className="confusable-b">b</span>eautiful <span className="confusable-d">d</span>iscoveries in <span className="confusable-p">p</span>lanetary <span className="confusable-q">q</span>uests show <span className="confusable-m">m</span>assive <span className="confusable-w">w</span>orlds.
              </span>
            ) : (
              'Reading is a bridge to knowledge. When typography and colors are calibrated to your optical comfort, reading becomes effortless and enjoyable.'
            )}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. Typography Preferences */}
        <section className="bg-surface-bright rounded-2xl p-6 border-2 border-surface-container-highest space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">text_fields</span>
            1. Typography & Font Hierarchy
          </h2>

          {/* Font Family Dropdown */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              Select Typeface (22 Curated Fonts)
            </label>
            <select
              value={profile.fontFamily}
              onChange={(e) => updateProfile({ fontFamily: e.target.value as FontFamily })}
              className="w-full p-3.5 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl text-sm font-medium text-on-background focus:border-primary focus:ring-0 cursor-pointer touch-target"
            >
              <optgroup label="Purpose-Built Dyslexia Fonts">
                {AVAILABLE_FONTS.filter((f) => f.category === 'purpose-built').map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name} — {font.description}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Accessibility & Low-Vision Tested">
                {AVAILABLE_FONTS.filter((f) => f.category === 'accessibility-focused').map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name} — {font.description}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Clean Humanist & Modern Sans">
                {AVAILABLE_FONTS.filter((f) => f.category === 'humanist-sans').map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name} — {font.description}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Familiar System Sans">
                {AVAILABLE_FONTS.filter((f) => f.category === 'standard-system').map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name} — {font.description}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Font Size (min 16px) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-on-surface">Font Size (Min 16px)</label>
              <span className="text-sm font-bold text-primary">{profile.fontSize}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="32"
              step="1"
              value={profile.fontSize}
              onChange={(e) => updateProfile({ fontSize: parseInt(e.target.value, 10) })}
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
              <span>16px (Accessible Min)</span>
              <span>18px (Recommended)</span>
              <span>32px</span>
            </div>
          </div>

          {/* Font Weight */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Boldness Contrast</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateProfile({ fontWeight: 400 })}
                className={`py-3 px-4 rounded-xl border-2 text-xs font-bold transition-all touch-target ${
                  profile.fontWeight === 400
                    ? 'border-primary bg-secondary-container text-on-secondary-container shadow-sm'
                    : 'border-surface-container-highest bg-surface-container-lowest text-on-surface'
                }`}
              >
                Regular (400)
              </button>
              <button
                type="button"
                onClick={() => updateProfile({ fontWeight: 700 })}
                className={`py-3 px-4 rounded-xl border-2 text-xs font-bold transition-all touch-target ${
                  profile.fontWeight === 700
                    ? 'border-primary bg-secondary-container text-on-secondary-container shadow-sm'
                    : 'border-surface-container-highest bg-surface-container-lowest text-on-surface'
                }`}
              >
                Bold (700)
              </button>
            </div>
          </div>
        </section>

        {/* 2. Spacing & Rhythm (WCAG Benchmarks) */}
        <section className="bg-surface-bright rounded-2xl p-6 border-2 border-surface-container-highest space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">format_line_spacing</span>
            2. Spacing & Rhythm (WCAG 2.1 Standards)
          </h2>

          {/* Line Spacing */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-on-surface">Line Spacing (Min 1.5×)</label>
              <span className="text-sm font-bold text-primary">{profile.lineHeight}×</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="2.4"
              step="0.1"
              value={profile.lineHeight}
              onChange={(e) => updateProfile({ lineHeight: parseFloat(e.target.value) })}
            />
          </div>

          {/* Letter Spacing */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-on-surface">Letter Spacing (Tracking)</label>
              <span className="text-sm font-bold text-primary">{profile.letterSpacing}em</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="0.20"
              step="0.01"
              value={profile.letterSpacing}
              onChange={(e) => updateProfile({ letterSpacing: parseFloat(e.target.value) })}
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
              <span>0.00em</span>
              <span className="text-primary font-bold">0.12em (WCAG Benchmark)</span>
              <span>0.20em</span>
            </div>
          </div>

          {/* Word Spacing */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-on-surface">Word Spacing</label>
              <span className="text-sm font-bold text-primary">{profile.wordSpacing}em</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="0.40"
              step="0.02"
              value={profile.wordSpacing}
              onChange={(e) => updateProfile({ wordSpacing: parseFloat(e.target.value) })}
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
              <span>0.00em</span>
              <span className="text-primary font-bold">0.16em (WCAG Benchmark)</span>
              <span>0.40em</span>
            </div>
          </div>

          {/* Line Length Cap (45 - 100 characters) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-on-surface">Line Length Cap (CPL)</label>
              <span className="text-sm font-bold text-primary">{profile.maxCharactersPerLine} chars</span>
            </div>
            <input
              type="range"
              min="45"
              max="100"
              step="5"
              value={profile.maxCharactersPerLine}
              onChange={(e) => updateProfile({ maxCharactersPerLine: parseInt(e.target.value, 10) })}
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
              <span>45 chars (Narrow)</span>
              <span>65 chars (Optimal)</span>
              <span>100 chars (Max)</span>
            </div>
          </div>
        </section>

        {/* 3. Reading Colors & Anti-Glare System */}
        <section className="bg-surface-bright rounded-2xl p-6 border-2 border-surface-container-highest space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">palette</span>
            3. Reading Color Palettes & Glare Reduction
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {THEME_PRESETS.map((t) => {
              const isSelected = profile.themePreset === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemePresetChange(t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between min-h-[105px] touch-target ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/40 shadow-md'
                      : 'border-surface-container-highest hover:border-primary/30'
                  }`}
                  style={{ backgroundColor: t.bg, color: t.text }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-sm">{t.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/10 text-current">
                      {t.wcagLevel}
                    </span>
                  </div>
                  <span className="text-[11px] opacity-80 mt-1">{t.description}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Highlighting & Confusable Letters */}
        <section className="bg-surface-bright rounded-2xl p-6 border-2 border-surface-container-highest space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            4. Highlighting & Confusable Letter Tools
          </h2>

          {/* Highlighting Modes */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">Reading Highlight Mode</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(
                [
                  { id: 'none', label: 'None' },
                  { id: 'word', label: 'Current Word' },
                  { id: 'phrase', label: 'Current Phrase' },
                  { id: 'line', label: 'Current Line' },
                  { id: 'selective', label: 'Selective' },
                ] as { id: HighlightMode; label: string }[]
              ).map((m) => {
                const isSelected = highlightMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setHighlightMode(m.id)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-primary bg-secondary-container text-on-secondary-container shadow-xs'
                        : 'border-surface-container-highest bg-surface-container-lowest text-on-surface'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confusable Letter Highlighting Toggle */}
          <div className="p-4 rounded-xl bg-surface-container-lowest border-2 border-surface-container-highest space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-on-surface">Confusable Letter Markers</p>
                <p className="text-xs text-on-surface-variant">
                  Visually distinguish commonly inverted letter pairs with subtle underline/overline cues.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfusableLettersEnabled(!confusableLettersEnabled)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                  confusableLettersEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    confusableLettersEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {confusableLettersEnabled && (
              <div className="pt-2 border-t border-surface-container-highest flex items-center gap-4 flex-wrap">
                <span className="text-xs font-bold text-on-surface-variant">Active Pairs:</span>
                {(
                  [
                    { id: 'bd', label: 'b / d' },
                    { id: 'pq', label: 'p / q' },
                    { id: 'mw', label: 'm / w' },
                  ] as { id: ConfusablePair; label: string }[]
                ).map((pair) => (
                  <label key={pair.id} className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confusablePairs.includes(pair.id)}
                      onChange={() => toggleConfusablePair(pair.id)}
                      className="rounded text-primary focus:ring-0"
                    />
                    <span>{pair.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 5. Multilingual & Audio Preferences */}
        <section className="bg-surface-bright rounded-2xl p-6 border-2 border-surface-container-highest space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">language</span>
            5. Multilingual & Audio Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">
                Preferred Reading Language
              </label>
              <select
                value={profile.preferredReadingLanguage}
                onChange={(e) => updateProfile({ preferredReadingLanguage: e.target.value as SupportedLanguage })}
                className="w-full p-3 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl text-xs font-bold text-on-surface"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">
                Speech Rate
              </label>
              <select
                value={profile.ttsSpeed || 1.0}
                onChange={(e) => updateProfile({ ttsSpeed: parseFloat(e.target.value) })}
                className="w-full p-3 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl text-xs font-bold text-on-surface"
              >
                <option value="0.5">0.5× (Slow)</option>
                <option value="0.75">0.75× (Relaxed)</option>
                <option value="1.0">1.0× (Normal)</option>
                <option value="1.25">1.25× (Brisk)</option>
                <option value="1.5">1.5× (Fast)</option>
                <option value="2.0">2.0× (Very Fast)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Global Save & Reset Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3.5 px-6 rounded-full bg-primary text-on-primary font-bold text-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 shadow-sm touch-target"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            Save as Global Preferences
          </button>

          <button
            type="button"
            onClick={() => router.push('/calibrate')}
            className="py-3.5 px-6 rounded-full bg-secondary-container text-on-secondary-container font-bold text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 touch-target"
          >
            <span className="material-symbols-outlined text-lg">autorenew</span>
            Redo Calibration Test
          </button>

          <button
            type="button"
            onClick={resetProfile}
            className="py-3.5 px-6 rounded-full bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 touch-target"
          >
            <span className="material-symbols-outlined text-lg">restart_alt</span>
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
