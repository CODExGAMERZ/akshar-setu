'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useReader } from '@/context/ReaderContext';
import { AIProvider, UserApiConfig } from '@/types';
import { StorageService } from '@/lib/storage';

export default function SettingsPage() {
  const router = useRouter();
  const { profile, resetProfile } = useReader();

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
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-primary mb-1">
            Application Settings
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Manage your AI engine configuration and reading environment preferences.
          </p>
        </div>

        <Link
          href="/profile"
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs sm:text-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2 self-start sm:self-auto touch-target shadow-sm"
        >
          <span className="material-symbols-outlined text-base">tune</span>
          Open Reading Profile
        </Link>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Section 1: AI Translation & Simplification Engine (BYOK) */}
        <section className="bg-surface-bright rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-surface-container-highest space-y-5 sm:space-y-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">psychology</span>
              AI Translation & Simplification Engine (BYOK)
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">lock</span>
              Zero Leakage Safe
            </span>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Choose whether to use our pre-configured server-side AI or bring your own API key. Keys are safely kept in your local storage and never leaked.
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
                Uses pre-configured backend endpoints. Fully managed, secure, and ready with zero setup.
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
            <div className="p-4 sm:p-5 bg-surface-container-low rounded-xl border-2 border-surface-container-highest space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2">
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

              {/* Dynamic Key Input */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5">
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

        {/* Section 2: Quick Links to Profile & Calibration */}
        <section className="bg-surface-bright rounded-2xl p-5 sm:p-6 border-2 border-surface-container-highest flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-on-surface">
              Visual Preferences & 22 Dyslexia Fonts
            </h3>
            <p className="text-xs text-on-surface-variant">
              Adjust character spacing, line height (min 1.5×), and anti-glare color palettes.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/profile"
              className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-1.5 touch-target"
            >
              <span>Edit Profile</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link
              href="/calibrate"
              className="px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface font-bold text-xs hover:bg-surface-container-highest transition-colors flex items-center gap-1.5 touch-target"
            >
              <span>Recalibrate</span>
              <span className="material-symbols-outlined text-sm">autorenew</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
