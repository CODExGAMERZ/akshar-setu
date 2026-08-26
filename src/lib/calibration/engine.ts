import { CalibrationStep, ReadingProfile } from '@/types';
import { DEFAULT_READING_PROFILE } from '../constants';

export const CALIBRATION_STEPS: CalibrationStep[] = [
  {
    id: 1,
    title: 'Font Letterforms',
    description: 'Which font makes the letter shapes clearer for you?',
    variableTested: 'font',
    sampleA: {
      label: 'Sample A (Open Sans)',
      text: 'The quick brown fox jumps over the lazy dog. Clear shapes and open apertures help letters stay distinct.',
      style: { fontFamily: 'Open Sans', fontWeight: 400 },
      icon: 'font_download',
    },
    sampleB: {
      label: 'Sample B (Lexend)',
      text: 'The quick brown fox jumps over the lazy dog. Clear shapes and open apertures help letters stay distinct.',
      style: { fontFamily: 'Lexend', fontWeight: 400 },
      icon: 'text_format',
    },
  },
  {
    id: 2,
    title: 'Line Spacing (Leading)',
    description: 'Which spacing prevents lines from blurring or overlapping into each other?',
    variableTested: 'lineSpacing',
    sampleA: {
      label: 'Sample A (Standard 1.4×)',
      text: 'Reading should feel comfortable and natural. Adequate line height prevents line-skipping and helps the eye return smoothly to the left margin.',
      style: { lineHeight: 1.4 },
      icon: 'format_line_spacing',
    },
    sampleB: {
      label: 'Sample B (Relaxed 1.9×)',
      text: 'Reading should feel comfortable and natural. Adequate line height prevents line-skipping and helps the eye return smoothly to the left margin.',
      style: { lineHeight: 1.9 },
      icon: 'format_line_spacing',
    },
  },
  {
    id: 3,
    title: 'Letter Spacing (Tracking)',
    description: 'Which spacing keeps individual characters distinct without crowding?',
    variableTested: 'letterSpacing',
    sampleA: {
      label: 'Sample A (Standard Spacing)',
      text: 'Each letter in a word stands out clearly when given comfortable room to breathe.',
      style: { letterSpacing: 0.01 },
      icon: 'text_fields',
    },
    sampleB: {
      label: 'Sample B (Wide Spacing +0.06em)',
      text: 'Each letter in a word stands out clearly when given comfortable room to breathe.',
      style: { letterSpacing: 0.06 },
      icon: 'format_letter_spacing',
    },
  },
  {
    id: 4,
    title: 'Background Tint & Glare',
    description: 'Which background feels calmer and reduces visual stress or shimmering?',
    variableTested: 'backgroundColor',
    sampleA: {
      label: 'Sample A (Warm Ivory Cream)',
      text: 'Soft off-white backgrounds absorb harsh screen glare, helping your eyes focus calmly without fatigue.',
      style: { backgroundColor: '#fbf9f8', textColor: '#1b1c1c', themePreset: 'warm-cream' },
      icon: 'palette',
    },
    sampleB: {
      label: 'Sample B (Soft Peach Tint)',
      text: 'Soft off-white backgrounds absorb harsh screen glare, helping your eyes focus calmly without fatigue.',
      style: { backgroundColor: '#fff5ee', textColor: '#2d2424', themePreset: 'soft-peach' },
      icon: 'palette',
    },
  },
  {
    id: 5,
    title: 'Word Spacing',
    description: 'Which gap between words makes word boundaries easier to spot?',
    variableTested: 'wordSpacing',
    sampleA: {
      label: 'Sample A (Standard Gap 0.10em)',
      text: 'Clear spaces between words prevent sentences from looking like one continuous block of text.',
      style: { wordSpacing: 0.10 },
      icon: 'space_bar',
    },
    sampleB: {
      label: 'Sample B (Extended Gap 0.25em)',
      text: 'Clear spaces between words prevent sentences from looking like one continuous block of text.',
      style: { wordSpacing: 0.25 },
      icon: 'space_bar',
    },
  },
  {
    id: 6,
    title: 'Text Contrast & Weight',
    description: 'Which contrast weight helps you decode words with less eye strain?',
    variableTested: 'fontWeight',
    sampleA: {
      label: 'Sample A (Regular Weight)',
      text: 'Balanced contrast gives letters crisp structure without causing strong glare or halos around characters.',
      style: { fontWeight: 400 },
      icon: 'format_bold',
    },
    sampleB: {
      label: 'Sample B (Bold Accentuated)',
      text: 'Balanced contrast gives letters crisp structure without causing strong glare or halos around characters.',
      style: { fontWeight: 700 },
      icon: 'format_bold',
    },
  },
  {
    id: 7,
    title: 'Alternative High-Accessibility Font',
    description: 'Do you prefer high-distinction letterforms or standard clean shapes?',
    variableTested: 'font',
    sampleA: {
      label: 'Sample A (Atkinson Hyperlegible)',
      text: 'Distinct loops, tails, and ascenders prevent confusing characters like capital I, lowercase l, and number 1.',
      style: { fontFamily: 'Atkinson Hyperlegible' },
      icon: 'accessibility_new',
    },
    sampleB: {
      label: 'Sample B (Verdana)',
      text: 'Distinct loops, tails, and ascenders prevent confusing characters like capital I, lowercase l, and number 1.',
      style: { fontFamily: 'Verdana' },
      icon: 'font_download',
    },
  },
  {
    id: 8,
    title: 'Cool vs. Warm Canvas',
    description: 'Which tone feels more relaxing for extended reading sessions?',
    variableTested: 'backgroundColor',
    sampleA: {
      label: 'Sample A (Mint Green Tint)',
      text: 'Subtle green spectral filters can reduce reading visual stress and perceptual distortion.',
      style: { backgroundColor: '#f2f8f5', textColor: '#1c2826', themePreset: 'mint-tint' },
      icon: 'format_paint',
    },
    sampleB: {
      label: 'Sample B (Warm Cream Base)',
      text: 'Subtle green spectral filters can reduce reading visual stress and perceptual distortion.',
      style: { backgroundColor: '#fbf9f8', textColor: '#1b1c1c', themePreset: 'warm-cream' },
      icon: 'format_paint',
    },
  },
  {
    id: 9,
    title: 'Line Length (Characters Per Line)',
    description: 'Which column width is easier to track from line to line?',
    variableTested: 'textWidth',
    sampleA: {
      label: 'Sample A (Optimal 60 CPL)',
      text: 'Shorter lines keep your eye from wandering or skipping lines when returning to the start of the next line.',
      style: { maxCharactersPerLine: 55 },
      icon: 'view_column',
    },
    sampleB: {
      label: 'Sample B (Standard 75 CPL)',
      text: 'Shorter lines keep your eye from wandering or skipping lines when returning to the start of the next line.',
      style: { maxCharactersPerLine: 75 },
      icon: 'view_column',
    },
  },
  {
    id: 10,
    title: 'Font Size & Scale',
    description: 'Which font size feels most comfortable without having to zoom in?',
    variableTested: 'lineSpacing',
    sampleA: {
      label: 'Sample A (Medium 18px)',
      text: 'Comfortable text scale allows quick decoding with minimal cognitive load.',
      style: { fontSize: 18 },
      icon: 'format_size',
    },
    sampleB: {
      label: 'Sample B (Large 22px)',
      text: 'Comfortable text scale allows quick decoding with minimal cognitive load.',
      style: { fontSize: 22 },
      icon: 'format_size',
    },
  },
];

export interface CalibrationChoice {
  stepId: number;
  choice: 'A' | 'B' | 'SAME';
}

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
    const step = CALIBRATION_STEPS.find((s) => s.id === c.stepId);
    if (!step) return;

    if (c.choice === 'A') {
      Object.assign(result, step.sampleA.style);
    } else if (c.choice === 'B') {
      Object.assign(result, step.sampleB.style);
    }
    // If 'SAME', leave default / previous converged value intact
  });

  return result;
}
