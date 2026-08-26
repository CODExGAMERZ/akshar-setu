'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FontOption, HighlightMode, ConfusablePair } from '../../types';
import { READING_THEMES } from '../../data/themes';
import { Slider } from '../common/Slider';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { Button } from '../common/Button';
import { 
  Type, 
  Palette, 
  Eye, 
  Sliders, 
  RotateCcw, 
  BookmarkCheck, 
  Save, 
  Glasses,
  Check
} from 'lucide-react';

export interface ReadingControlsProps {
  onClose?: () => void;
}

export const ReadingControls: React.FC<ReadingControlsProps> = ({ onClose }) => {
  const {
    preferences,
    updatePreferences,
    saveAsGlobalPreferences,
    saveForThisDocumentOnly,
    resetToCalibratedSettings,
    resetToDefaultSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'typography' | 'colors' | 'focus' | 'confusable'>('typography');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const fonts: Array<{ name: FontOption; label: string; note: string }> = [
    { name: 'Lexend', label: 'Lexend', note: 'Expands letter boundaries' },
    { name: 'Atkinson Hyperlegible', label: 'Atkinson', note: 'Disambiguated shapes' },
    { name: 'OpenDyslexic', label: 'OpenDyslexic', note: 'Bottom-weighted forms' },
    { name: 'Comic Neue', label: 'Comic Neue', note: 'Soft rounded angles' },
    { name: 'Arial', label: 'Arial', note: 'Clean standard sans' },
    { name: 'Verdana', label: 'Verdana', note: 'Wide screen spacing' }
  ];

  const highlightModes: Array<{ id: HighlightMode; label: string }> = [
    { id: 'word', label: 'Single Word' },
    { id: 'phrase', label: 'Phrase' },
    { id: 'line', label: 'Active Line' },
    { id: 'none', label: 'Off' }
  ];

  const confusablePairs: ConfusablePair[] = ['b/d', 'p/q', 'm/w', 'n/u'];

  const triggerSaveToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2000);
  };

  const handleGlobalSave = async () => {
    await saveAsGlobalPreferences();
    triggerSaveToast('Saved as Global Profile Default!');
  };

  const handleDocumentSave = async () => {
    await saveForThisDocumentOnly();
    triggerSaveToast('Saved for this document only!');
  };

  return (
    <div className="w-full bg-[#FAF3E0] border-l border-[#E7DFCA] flex flex-col h-full overflow-hidden text-[#26231E]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E7DFCA] flex items-center justify-between bg-[#FAF1DA]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#D97706]" />
          <h3 className="font-bold text-sm text-[#1E1B18]">Reading Personalization</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-[#706655] hover:text-[#1E1B18] px-2 py-1 rounded bg-[#FEF9EB] border border-[#E7DFCA]"
          >
            Done
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E7DFCA] bg-[#FAF3E0] p-1 gap-1">
        <button
          onClick={() => setActiveTab('typography')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'typography'
              ? 'bg-[#26231E] text-[#FEF9EB] shadow-2xs'
              : 'text-[#524B40] hover:text-[#26231E] hover:bg-[#EFE8D6]'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Type</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'colors'
              ? 'bg-[#26231E] text-[#FEF9EB] shadow-2xs'
              : 'text-[#524B40] hover:text-[#26231E] hover:bg-[#EFE8D6]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Colors</span>
        </button>

        <button
          onClick={() => setActiveTab('confusable')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'confusable'
              ? 'bg-[#26231E] text-[#FEF9EB] shadow-2xs'
              : 'text-[#524B40] hover:text-[#26231E] hover:bg-[#EFE8D6]'
          }`}
        >
          <Glasses className="w-3.5 h-3.5" />
          <span>b/d</span>
        </button>

        <button
          onClick={() => setActiveTab('focus')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'focus'
              ? 'bg-[#26231E] text-[#FEF9EB] shadow-2xs'
              : 'text-[#524B40] hover:text-[#26231E] hover:bg-[#EFE8D6]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Focus</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* TYPOGRAPHY TAB */}
        {activeTab === 'typography' && (
          <div className="space-y-5">
            {/* Font Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                Font Family
              </label>
              <div className="grid grid-cols-2 gap-2">
                {fonts.map(f => (
                  <button
                    key={f.name}
                    onClick={() => updatePreferences({ font: f.name })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      preferences.font === f.name
                        ? 'border-[#D97706] bg-[#FEF9EB] ring-2 ring-[#D97706]/30 font-bold'
                        : 'border-[#E7DFCA] bg-[#FEF9EB]/60 hover:bg-[#FEF9EB]'
                    }`}
                  >
                    <p className="text-xs text-[#1E1B18]">{f.label}</p>
                    <p className="text-[10px] text-[#706655] truncate">{f.note}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
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
              label="Line Height / Spacing"
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
              description="Reduces visual crowding between adjacent characters"
              onChange={(val) => updatePreferences({ letterSpacing: val })}
            />

            <Slider
              label="Word Spacing"
              value={preferences.wordSpacing}
              min={0}
              max={0.4}
              step={0.02}
              unit="em"
              description="Expands gaps between words to stop eye jumping"
              onChange={(val) => updatePreferences({ wordSpacing: val })}
            />

            <Slider
              label="Max Line Width"
              value={preferences.textWidth}
              min={45}
              max={85}
              step={2}
              unit="ch"
              description="Limits column width for comfortable saccadic tracking"
              onChange={(val) => updatePreferences({ textWidth: val })}
            />

            <ToggleSwitch
              label="Bionic Fixation Bold"
              checked={preferences.bionicReading}
              description="Subtly bolds initial letters to guide fixations"
              onChange={(checked) => updatePreferences({ bionicReading: checked })}
            />
          </div>
        )}

        {/* COLORS TAB */}
        {activeTab === 'colors' && (
          <div className="space-y-5">
            {/* Preset Themes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                Anti-Glare Reading Themes
              </label>
              <div className="space-y-2">
                {READING_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => updatePreferences({
                      themeId: theme.id,
                      backgroundColor: theme.backgroundColor,
                      textColor: theme.textColor,
                      highlightColor: theme.highlightColor
                    })}
                    className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
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
                      <p className="text-[11px] opacity-80 line-clamp-1" style={{ color: theme.textColor }}>
                        {theme.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Highlighting color */}
            <div className="space-y-2 pt-2 border-t border-[#E7DFCA]">
              <label className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                Highlight Accent Color
              </label>
              <div className="flex items-center gap-3">
                {['#FDE047', '#FBBF24', '#86EFAC', '#93C5FD', '#FDBA74', '#F472B6'].map(color => (
                  <button
                    key={color}
                    onClick={() => updatePreferences({ highlightColor: color })}
                    className={`w-8 h-8 rounded-full border transition-transform ${
                      preferences.highlightColor === color ? 'scale-110 ring-2 ring-black/40' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONFUSABLE LETTERS TAB */}
        {activeTab === 'confusable' && (
          <div className="space-y-5">
            <ToggleSwitch
              label="Enable Confusable Letter Disambiguation"
              checked={preferences.confusableLetterSettings.enabled}
              description="Visually differentiates mirror characters (e.g. b and d)"
              onChange={(checked) => updatePreferences({
                confusableLetterSettings: {
                  ...preferences.confusableLetterSettings,
                  enabled: checked
                }
              })}
            />

            {preferences.confusableLetterSettings.enabled && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                    Active Letter Pairs
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {confusablePairs.map(pair => {
                      const isActive = preferences.confusableLetterSettings.activePairs.includes(pair);
                      return (
                        <button
                          key={pair}
                          onClick={() => {
                            const current = preferences.confusableLetterSettings.activePairs;
                            const next = isActive
                              ? current.filter(p => p !== pair)
                              : [...current, pair];
                            updatePreferences({
                              confusableLetterSettings: {
                                ...preferences.confusableLetterSettings,
                                activePairs: next
                              }
                            });
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-[#FEF9EB] border-[#D97706] text-[#D97706]'
                              : 'bg-[#FEF9EB]/60 border-[#E7DFCA] text-[#706655]'
                          }`}
                        >
                          <span className="font-mono text-sm tracking-wider">{pair}</span>
                          {isActive && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                    Disambiguation Style
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['weight', 'subtle-color', 'underline', 'dot'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => updatePreferences({
                          confusableLetterSettings: {
                            ...preferences.confusableLetterSettings,
                            style
                          }
                        })}
                        className={`p-2 rounded-xl border text-center capitalize ${
                          preferences.confusableLetterSettings.style === style
                            ? 'bg-[#26231E] text-[#FEF9EB] font-bold'
                            : 'bg-[#FEF9EB] border-[#E7DFCA] text-[#524B40]'
                        }`}
                      >
                        {style.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* FOCUS & GUIDANCE TAB */}
        {activeTab === 'focus' && (
          <div className="space-y-5">
            {/* Highlight mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                Read-Along Guidance Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {highlightModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => updatePreferences({ highlightMode: mode.id })}
                    className={`p-2.5 rounded-xl border text-xs font-semibold ${
                      preferences.highlightMode === mode.id
                        ? 'bg-[#26231E] text-[#FEF9EB]'
                        : 'bg-[#FEF9EB] border-[#E7DFCA] text-[#524B40]'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <ToggleSwitch
              label="Reading Ruler Guide"
              checked={preferences.readingRuler}
              description="Places an optical reading ruler line under your cursor/reading line"
              onChange={(checked) => updatePreferences({ readingRuler: checked })}
            />

            <ToggleSwitch
              label="Distraction-Free Focus Mode"
              checked={preferences.focusMode}
              description="Collapses sidebars and centers the reading canvas"
              onChange={(checked) => updatePreferences({ focusMode: checked })}
            />

            <ToggleSwitch
              label="Auto-Scroll Read-Along"
              checked={preferences.autoScroll}
              description="Smoothly scrolls the page to keep spoken words in view"
              onChange={(checked) => updatePreferences({ autoScroll: checked })}
            />
          </div>
        )}
      </div>

      {/* Save Settings & Defaults Footer */}
      <div className="p-4 border-t border-[#E7DFCA] bg-[#FAF1DA] space-y-2">
        {saveToast && (
          <div className="p-2 rounded-lg bg-[#EDF5EC] border border-[#CBDBCB] text-xs text-[#047857] text-center font-bold animate-in fade-in">
            {saveToast}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Save className="w-3.5 h-3.5" />}
            onClick={handleGlobalSave}
          >
            Save as Global
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<BookmarkCheck className="w-3.5 h-3.5" />}
            onClick={handleDocumentSave}
          >
            Save for this Doc
          </Button>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-[#706655]">
          <button
            onClick={resetToCalibratedSettings}
            className="hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to Calibrated
          </button>

          <button
            onClick={resetToDefaultSettings}
            className="hover:underline"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};
