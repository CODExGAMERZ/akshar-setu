import { CalibrationResult, CalibrationRound, ReadingPreferences } from '../types';
import { CALIBRATION_ROUNDS } from '../data/calibrationData';
import { DEFAULT_READING_PREFERENCES } from '../data/themes';

class CalibrationService {
  public async getCalibrationRounds(): Promise<CalibrationRound[]> {
    await new Promise(r => setTimeout(r, 40));
    return JSON.parse(JSON.stringify(CALIBRATION_ROUNDS));
  }

  public synthesizePreferences(answers: Record<number, string>): ReadingPreferences {
    const preferences: ReadingPreferences = { ...DEFAULT_READING_PREFERENCES };

    // Round 1: Typography
    const round1Choice = answers[1];
    if (round1Choice === 'font_lexend') {
      preferences.font = 'Lexend';
      preferences.fontSize = 19;
      preferences.boldness = 450;
      preferences.letterSpacing = 0.04;
    } else if (round1Choice === 'font_atkinson') {
      preferences.font = 'Atkinson Hyperlegible';
      preferences.fontSize = 20;
      preferences.boldness = 500;
      preferences.letterSpacing = 0.06;
    } else if (round1Choice === 'font_opendyslexic') {
      preferences.font = 'OpenDyslexic';
      preferences.fontSize = 18;
      preferences.boldness = 400;
      preferences.letterSpacing = 0.05;
    } else if (round1Choice === 'font_comic_neue') {
      preferences.font = 'Comic Neue';
      preferences.fontSize = 20;
      preferences.boldness = 500;
      preferences.letterSpacing = 0.05;
    }

    // Round 2: Spacing
    const round2Choice = answers[2];
    if (round2Choice === 'spacing_spacious') {
      preferences.lineSpacing = 2.1;
      preferences.wordSpacing = 0.18;
      preferences.paragraphSpacing = 1.8;
      preferences.textWidth = 62;
    } else if (round2Choice === 'spacing_balanced') {
      preferences.lineSpacing = 1.85;
      preferences.wordSpacing = 0.12;
      preferences.paragraphSpacing = 1.5;
      preferences.textWidth = 68;
    } else if (round2Choice === 'spacing_compact_guided') {
      preferences.lineSpacing = 1.6;
      preferences.wordSpacing = 0.08;
      preferences.letterSpacing = 0.08;
      preferences.textWidth = 72;
    }

    // Round 3: Theme
    const round3Choice = answers[3];
    if (round3Choice === 'theme_warm_cream') {
      preferences.themeId = 'warm-cream';
      preferences.backgroundColor = '#FEF9EB';
      preferences.textColor = '#26231E';
      preferences.highlightColor = '#FDE047';
    } else if (round3Choice === 'theme_soft_yellow') {
      preferences.themeId = 'anti-glare-soft-yellow';
      preferences.backgroundColor = '#FEF08A';
      preferences.textColor = '#1E1B18';
      preferences.highlightColor = '#FBBF24';
    } else if (round3Choice === 'theme_calm_sage') {
      preferences.themeId = 'calm-sage';
      preferences.backgroundColor = '#EDF5EC';
      preferences.textColor = '#1A2E1C';
      preferences.highlightColor = '#86EFAC';
    } else if (round3Choice === 'theme_slate_blue') {
      preferences.themeId = 'slate-blue';
      preferences.backgroundColor = '#EEF4F8';
      preferences.textColor = '#1E2B37';
      preferences.highlightColor = '#93C5FD';
    }

    // Round 4: Highlighting
    const round4Choice = answers[4];
    if (round4Choice === 'highlight_word') {
      preferences.highlightMode = 'word';
    } else if (round4Choice === 'highlight_phrase') {
      preferences.highlightMode = 'phrase';
    } else if (round4Choice === 'highlight_line') {
      preferences.highlightMode = 'line';
      preferences.readingRuler = true;
    } else if (round4Choice === 'highlight_none') {
      preferences.highlightMode = 'none';
      preferences.readingRuler = false;
    }

    return preferences;
  }

  public async saveResult(result: CalibrationResult): Promise<boolean> {
    await new Promise(r => setTimeout(r, 60));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('aksharsetu_latest_calibration', JSON.stringify(result));
      } catch (e) {

        console.warn('Failed to store calibration result:', e);
      }
    }
    return true;
  }
}

export const calibrationService = new CalibrationService();
