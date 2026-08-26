import { CalibrationChoice, CalibrationResult, CalibrationStep, ReadingProfile } from '@/types';
import { DEFAULT_READING_PROFILE } from '@/lib/constants';
import { StorageService } from '@/lib/storage';

export type { CalibrationChoice, CalibrationResult, CalibrationStep };

export const CALIBRATION_ROUNDS_DATA: CalibrationStep[] = [
  // Round 1: Typography Selection
  {
    id: 1,
    roundNumber: 1,
    title: 'Round 1: Letterform Clarity',
    description: 'Which font makes individual letter shapes and characters distinct without confusion?',
    variableTested: 'font',
    sampleA: {
      label: 'Sample A (OpenDyslexic)',
      text: 'The quick brown fox jumps over the lazy dog. Heavy bottoms and open counters prevent letter flipping and rotation.',
      style: { fontFamily: 'OpenDyslexic', fontWeight: 400 },
      icon: 'font_download',
    },
    sampleB: {
      label: 'Sample B (Atkinson Hyperlegible)',
      text: 'The quick brown fox jumps over the lazy dog. Unmistakable forms distinguish tricky letters like capital I, lowercase l, and number 1.',
      style: { fontFamily: 'Atkinson Hyperlegible', fontWeight: 400 },
      icon: 'accessibility_new',
    },
  },
  {
    id: 2,
    roundNumber: 1,
    title: 'Round 1b: Modern High-Legibility Sans',
    description: 'Do you prefer modern tall x-height letterforms or classic wide geometric curves?',
    variableTested: 'font',
    sampleA: {
      label: 'Sample A (Inter)',
      text: 'Clear structure and generous spacing allow smooth horizontal tracking across dense lines of text.',
      style: { fontFamily: 'Inter', fontWeight: 400 },
      icon: 'text_format',
    },
    sampleB: {
      label: 'Sample B (Verdana)',
      text: 'Clear structure and generous spacing allow smooth horizontal tracking across dense lines of text.',
      style: { fontFamily: 'Verdana', fontWeight: 400 },
      icon: 'text_fields',
    },
  },

  // Round 2: Spacing & Rhythm (WCAG Benchmarks)
  {
    id: 3,
    roundNumber: 2,
    title: 'Round 2: Line Spacing (Leading)',
    description: 'Which spacing prevents lines from overlapping or blurring into each other as you read?',
    variableTested: 'lineSpacing',
    sampleA: {
      label: 'Sample A (WCAG Recommended 1.6×)',
      text: 'Generous line height gives your eyes plenty of breathing room to track smoothly and return to the start of the next line.',
      style: { lineHeight: 1.6 },
      icon: 'format_line_spacing',
    },
    sampleB: {
      label: 'Sample B (Expanded 1.9×)',
      text: 'Generous line height gives your eyes plenty of breathing room to track smoothly and return to the start of the next line.',
      style: { lineHeight: 1.9 },
      icon: 'format_line_spacing',
    },
  },
  {
    id: 4,
    roundNumber: 2,
    title: 'Round 2b: Letter & Word Spacing',
    description: 'Which character spacing prevents crowding between adjacent words?',
    variableTested: 'wordSpacing',
    sampleA: {
      label: 'Sample A (WCAG 0.12em / 0.16em)',
      text: 'Clear gaps between characters and words make it easier to decode syllables in unfamiliar vocabulary.',
      style: { letterSpacing: 0.08, wordSpacing: 0.16 },
      icon: 'space_bar',
    },
    sampleB: {
      label: 'Sample B (Standard Density)',
      text: 'Clear gaps between characters and words make it easier to decode syllables in unfamiliar vocabulary.',
      style: { letterSpacing: 0.02, wordSpacing: 0.10 },
      icon: 'space_bar',
    },
  },

  // Round 3: Anti-Glare Color Themes
  {
    id: 5,
    roundNumber: 3,
    title: 'Round 3: Color Tone & Contrast',
    description: 'Which background feels calmest and reduces visual vibration or glare on your screen?',
    variableTested: 'backgroundColor',
    sampleA: {
      label: 'Sample A (Warm Ivory Cream)',
      text: 'Soft off-white cream absorbs harsh blue screen light, easing visual strain during extended reading.',
      style: { backgroundColor: '#fbf9f8', textColor: '#1b1c1c', themePreset: 'warm-cream' },
      icon: 'palette',
    },
    sampleB: {
      label: 'Sample B (Soft Sage / Mint)',
      text: 'Soft off-white cream absorbs harsh blue screen light, easing visual strain during extended reading.',
      style: { backgroundColor: '#f0f7f2', textColor: '#1c2826', themePreset: 'mint-tint' },
      icon: 'palette',
    },
  },
  {
    id: 6,
    roundNumber: 3,
    title: 'Round 3b: Dark Mode vs Soft Yellow',
    description: 'Do you prefer dark low-illumination canvas or soothing soft yellow tint?',
    variableTested: 'backgroundColor',
    sampleA: {
      label: 'Sample A (Dark Charcoal)',
      text: 'Dark background eliminates ambient screen glow in dim light environments.',
      style: { backgroundColor: '#1e1e1e', textColor: '#f3f0f0', themePreset: 'high-contrast-dark' },
      icon: 'dark_mode',
    },
    sampleB: {
      label: 'Sample B (Soft Yellow)',
      text: 'Pale yellow spectral tint reduces glare and visual stress on light screens.',
      style: { backgroundColor: '#fcf8e3', textColor: '#24211a', themePreset: 'soft-yellow' },
      icon: 'light_mode',
    },
  },

  // Round 4: Highlighting & Focus Tools
  {
    id: 7,
    roundNumber: 4,
    title: 'Round 4: Focus & Highlighting Assistance',
    description: 'Which visual cue helps you maintain your place in the text most effectively?',
    variableTested: 'highlighting',
    sampleA: {
      label: 'Sample A (Digital Reading Ruler)',
      text: 'A soft horizontal ruler guides your eye across the active line while gently dimming surrounding lines.',
      style: { readingRulerEnabled: true, highlightMode: 'line' },
      icon: 'highlight',
    },
    sampleB: {
      label: 'Sample B (Word Synchronized Highlighting)',
      text: 'A soft horizontal ruler guides your eye across the active line while gently dimming surrounding lines.',
      style: { readingRulerEnabled: false, highlightMode: 'word' },
      icon: 'auto_awesome',
    },
  },

  // Round 5: Final Converged Comparison
  {
    id: 8,
    roundNumber: 5,
    title: 'Round 5: Final Reading Comfort Comparison',
    description: 'Confirm the combined typography, spacing, and contrast settings that feel easiest to read.',
    variableTested: 'textWidth',
    sampleA: {
      label: 'Sample A (Optimized 60 CPL Column)',
      text: 'Shorter lines keep your eyes from wandering and eliminate line skipping when moving down the page.',
      style: { maxCharactersPerLine: 60 },
      icon: 'view_column',
    },
    sampleB: {
      label: 'Sample B (Standard 80 CPL Column)',
      text: 'Shorter lines keep your eyes from wandering and eliminate line skipping when moving down the page.',
      style: { maxCharactersPerLine: 80 },
      icon: 'view_column',
    },
  },
];

export const CALIBRATION_STEPS = CALIBRATION_ROUNDS_DATA;

export function computeCalibratedProfile(
  choices: CalibrationChoice[],
  baseProfile: ReadingProfile = DEFAULT_READING_PROFILE
): ReadingProfile {
  const result: ReadingProfile = {
    ...baseProfile,
    id: `profile-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };

  choices.forEach((c) => {
    const step = CALIBRATION_ROUNDS_DATA.find((s) => s.id === c.stepId);
    if (!step) return;

    if (c.choice === 'A') {
      Object.assign(result, step.sampleA.style);
    } else if (c.choice === 'B') {
      Object.assign(result, step.sampleB.style);
    }
  });

  return result;
}
