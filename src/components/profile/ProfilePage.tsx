'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FontOption } from '../../types';
import { READING_THEMES, SUPPORTED_LANGUAGES } from '../../data/themes';
import { Slider } from '../common/Slider';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { Button } from '../common/Button';
import { 
  Sparkles, 
  Type, 
  Palette, 
  Volume2, 
  RotateCcw, 
  Save, 
  Download, 
  CheckCircle2, 
  Glasses,
  LogOut
} from 'lucide-react';
import { profileService } from '../../services/profileService';

export const ProfilePage: React.FC = () => {
  const { 
    currentUser, 
    logoutUser, 
    preferences, 
    updatePreferences, 
    saveAsGlobalPreferences, 
    resetToCalibratedSettings, 
    resetToDefaultSettings, 
    profile, 
    setCurrentRoute 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'typography' | 'colors' | 'confusable' | 'audio' | 'calibration'>('typography');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const fonts: Array<{ name: FontOption; label: string }> = [
    { name: 'Lexend', label: 'Lexend' },
    { name: 'Atkinson Hyperlegible', label: 'Atkinson Hyperlegible' },
    { name: 'OpenDyslexic', label: 'OpenDyslexic' },
    { name: 'Comic Neue', label: 'Comic Neue' },
    { name: 'Arial', label: 'Arial' },
    { name: 'Verdana', label: 'Verdana' }
  ];

  const handleSave = async () => {
    await saveAsGlobalPreferences();
    setSaveToast('Reading Profile saved successfully!');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleExport = () => {
    const jsonStr = profileService.exportProfileJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AksharSetu_Profile_${currentUser?.name || 'User'}.json`;
    a.click();
  };


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#26231E]">
      {/* Profile Header Card */}
      <div className="bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#26231E] text-[#FEF9EB] text-2xl font-bold flex items-center justify-center shadow-sm">
            {currentUser?.avatar || 'AR'}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#1E1B18] tracking-tight">
              {currentUser?.name || 'Alex Rivera'}
            </h1>
            <p className="text-xs text-[#706655]">
              {currentUser?.email || 'alex@aksharsetu.org'} • Role: <span className="capitalize font-semibold text-[#1E1B18]">{currentUser?.role || 'student'}</span>
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF1DA] text-[#8C6D23] border border-[#E4D5AD]">
                Ivory Clarity Design Profile
              </span>
              {profile?.calibratedAt && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF5EC] text-[#047857] border border-[#CBDBCB] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Calibrated
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Export JSON
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={<LogOut className="w-4 h-4 text-[#DC2626]" />}
            onClick={logoutUser}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Settings Navigation & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Settings Tabs */}
        <div className="bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl p-2 sm:p-3 space-y-1 h-fit">
          <button
            onClick={() => setActiveTab('typography')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'typography'
                ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs'
                : 'text-[#524B40] hover:bg-[#EFE8D6]'
            }`}
          >
            <Type className="w-4 h-4" />
            Reading Typography
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'colors'
                ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs'
                : 'text-[#524B40] hover:bg-[#EFE8D6]'
            }`}
          >
            <Palette className="w-4 h-4" />
            Anti-Glare Themes
          </button>

          <button
            onClick={() => setActiveTab('confusable')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'confusable'
                ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs'
                : 'text-[#524B40] hover:bg-[#EFE8D6]'
            }`}
          >
            <Glasses className="w-4 h-4" />
            Confusable Letters (b/d)
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'audio'
                ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs'
                : 'text-[#524B40] hover:bg-[#EFE8D6]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            Speech & Audio
          </button>

          <button
            onClick={() => setActiveTab('calibration')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'calibration'
                ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs'
                : 'text-[#524B40] hover:bg-[#EFE8D6]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            Calibration History
          </button>
        </div>

        {/* Right Settings Panel */}
        <div className="lg:col-span-3 bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          {saveToast && (
            <div className="p-3 rounded-xl bg-[#EDF5EC] border border-[#CBDBCB] text-xs text-[#047857] text-center font-bold animate-in fade-in">
              {saveToast}
            </div>
          )}

          {/* TAB 1: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#1E1B18]">Reading Typography Settings</h3>
                <p className="text-xs text-[#706655]">
                  Configure your baseline font family, sizing, tracking, and line spacing.
                </p>
              </div>

              {/* Font Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                  Font Family
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {fonts.map(f => (
                    <button
                      key={f.name}
                      onClick={() => updatePreferences({ font: f.name })}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        preferences.font === f.name
                          ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs'
                          : 'bg-[#FEF9EB] border-[#E7DFCA] text-[#26231E] hover:bg-[#EFE8D6]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <Slider
                  label="Font Size"
                  value={preferences.fontSize}
                  min={14}
                  max={34}
                  step={1}
                  unit="px"
                  onChange={(val) => updatePreferences({ fontSize: val })}
                />

                <Slider
                  label="Line Height"
                  value={preferences.lineSpacing}
                  min={1.4}
                  max={2.6}
                  step={0.1}
                  unit="x"
                  onChange={(val) => updatePreferences({ lineSpacing: val })}
                />

                <Slider
                  label="Letter Spacing"
                  value={preferences.letterSpacing}
                  min={0}
                  max={0.2}
                  step={0.01}
                  unit="em"
                  onChange={(val) => updatePreferences({ letterSpacing: val })}
                />

                <Slider
                  label="Word Spacing"
                  value={preferences.wordSpacing}
                  min={0}
                  max={0.4}
                  step={0.02}
                  unit="em"
                  onChange={(val) => updatePreferences({ wordSpacing: val })}
                />

                <Slider
                  label="Paragraph Gap"
                  value={preferences.paragraphSpacing}
                  min={0.8}
                  max={3.0}
                  step={0.1}
                  unit="rem"
                  onChange={(val) => updatePreferences({ paragraphSpacing: val })}
                />

                <Slider
                  label="Text Max Width"
                  value={preferences.textWidth}
                  min={45}
                  max={85}
                  step={2}
                  unit="ch"
                  onChange={(val) => updatePreferences({ textWidth: val })}
                />
              </div>

              <div className="pt-2">
                <ToggleSwitch
                  label="Bionic Fixation Bold"
                  checked={preferences.bionicReading}
                  description="Subtly bolds initial letters to assist eye fixations across words"
                  onChange={(checked) => updatePreferences({ bionicReading: checked })}
                />
              </div>
            </div>
          )}

          {/* TAB 2: COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#1E1B18]">Anti-Glare Color Themes</h3>
                <p className="text-xs text-[#706655]">
                  Ivory Clarity soft parchment hues and gentle contrast palettes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {READING_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => updatePreferences({
                      themeId: theme.id,
                      backgroundColor: theme.backgroundColor,
                      textColor: theme.textColor,
                      highlightColor: theme.highlightColor
                    })}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      preferences.themeId === theme.id
                        ? 'border-[#D97706] ring-2 ring-[#D97706]/30 shadow-xs'
                        : 'border-[#E7DFCA] hover:border-[#8C7A5D]'
                    }`}
                    style={{ backgroundColor: theme.backgroundColor }}
                  >
                    <div 
                      className="w-5 h-5 rounded-full border border-black/20 shrink-0 mt-0.5"
                      style={{ backgroundColor: theme.highlightColor }}
                    />
                    <div>
                      <p className="text-xs font-bold" style={{ color: theme.textColor }}>
                        {theme.name}
                      </p>
                      <p className="text-[11px] opacity-80 mt-1 line-clamp-2" style={{ color: theme.textColor }}>
                        {theme.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONFUSABLE LETTERS */}
          {activeTab === 'confusable' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#1E1B18]">Confusable Letter Disambiguation</h3>
                <p className="text-xs text-[#706655]">
                  Helps differentiate mirror characters such as b/d, p/q, m/w, n/u.
                </p>
              </div>

              <ToggleSwitch
                label="Enable Character Disambiguation"
                checked={preferences.confusableLetterSettings.enabled}
                description="Highlights or weights commonly flipped letters in reading view"
                onChange={(checked) => updatePreferences({
                  confusableLetterSettings: {
                    ...preferences.confusableLetterSettings,
                    enabled: checked
                  }
                })}
              />

              {preferences.confusableLetterSettings.enabled && (
                <div className="p-4 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                    Interactive Disambiguation Demo:
                  </h4>
                  <div className="p-4 bg-[#FAF3E0] rounded-xl text-base leading-relaxed">
                    <p>
                      &ldquo;The <span className="font-black text-[#B45309]">b</span>old <span className="font-black text-[#047857]">d</span>og jumped over the <span className="font-black text-[#B45309]">p</span>ond <span className="font-black text-[#047857]">q</span>uickly, enjoying the <span className="font-black text-[#B45309]">w</span>arm <span className="font-black text-[#047857]">m</span>orning sunlight.&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIO & SPEECH */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#1E1B18]">Text-to-Speech & Read-Along</h3>
                <p className="text-xs text-[#706655]">
                  Configure speech playback speed, boundary tracking, and languages.
                </p>
              </div>

              <Slider
                label="Default Read-Aloud Speed"
                value={preferences.ttsSpeed}
                min={0.5}
                max={2.0}
                step={0.25}
                unit="x"
                onChange={(val) => updatePreferences({ ttsSpeed: val })}
              />

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                  Default Reading Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => updatePreferences({ language: e.target.value })}
                  className="w-full bg-[#FEF9EB] border border-[#D8CEB9] rounded-xl p-2.5 text-xs font-bold text-[#26231E] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB 5: CALIBRATION */}
          {activeTab === 'calibration' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#1E1B18]">Calibration History & Management</h3>
                <p className="text-xs text-[#706655]">
                  Review your calibrated reading profile or run the 5-step test again.
                </p>
              </div>

              <div className="p-4 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E1B18]">Latest Calibration Status:</span>
                  <span className="text-xs font-semibold text-[#047857]">
                    {profile?.calibratedAt ? new Date(profile.calibratedAt).toLocaleDateString() : 'Active Profile'}
                  </span>
                </div>
                <p className="text-xs text-[#524B40]">
                  Your reading environment is currently optimized with <strong>{preferences.font}</strong> typography, <strong>{preferences.lineSpacing}x</strong> line height, and warm anti-glare ivory canvas.
                </p>
                <div className="pt-2">
                  <Button
                    variant="accent"
                    size="sm"
                    icon={<Sparkles className="w-3.5 h-3.5" />}
                    onClick={() => setCurrentRoute('calibration')}
                  >
                    Redo 5-Step Reading Calibration
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Footer Actions */}
          <div className="pt-6 border-t border-[#E7DFCA] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                icon={<Save className="w-4 h-4" />}
                onClick={handleSave}
              >
                Save Changes to Profile
              </Button>

              <Button
                variant="outline"
                size="md"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={resetToCalibratedSettings}
              >
                Reset to Calibrated
              </Button>
            </div>

            <button
              onClick={resetToDefaultSettings}
              className="text-xs text-[#706655] hover:text-[#DC2626] underline"
            >
              Reset to Factory Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
