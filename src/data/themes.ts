import { ReadingTheme, ReadingPreferences } from '../types';

export const READING_THEMES: ReadingTheme[] = [
  {
    id: 'warm-cream',
    name: 'Ivory Clarity (Warm Cream)',
    backgroundColor: '#FEF9EB',
    textColor: '#26231E',
    highlightColor: '#FDE047',
    secondaryBg: '#F7F1DF',
    borderColor: '#E7DFCA',
    description: 'Researched soft parchment tone that eliminates optical glare and letter vibration.'
  },
  {
    id: 'anti-glare-soft-yellow',
    name: 'Soft Solar Yellow',
    backgroundColor: '#FEF08A',
    textColor: '#1E1B18',
    highlightColor: '#FBBF24',
    secondaryBg: '#FDE047',
    borderColor: '#EAB308',
    description: 'Calibrated pale yellow filter proven to stabilize scotopic sensitivity and tracking.'
  },
  {
    id: 'calm-sage',
    name: 'Calm Sage Green',
    backgroundColor: '#EDF5EC',
    textColor: '#1A2E1C',
    highlightColor: '#86EFAC',
    secondaryBg: '#E0EDE0',
    borderColor: '#CBDBCB',
    description: 'Muted natural green that reduces visual cortex fatigue during long reading sessions.'
  },
  {
    id: 'slate-blue',
    name: 'Peaceful Slate Blue',
    backgroundColor: '#EEF4F8',
    textColor: '#1E2B37',
    highlightColor: '#93C5FD',
    secondaryBg: '#DFEAF1',
    borderColor: '#CADCE6',
    description: 'Cool anti-reflective light blue tint that anchors lines for visual readers.'
  },
  {
    id: 'soft-peach',
    name: 'Gentle Terracotta Peach',
    backgroundColor: '#FDF2EB',
    textColor: '#321F17',
    highlightColor: '#FDBA74',
    secondaryBg: '#F6E4D8',
    borderColor: '#E8D0C0',
    description: 'Warm earth tone with gentle contrast for comfortable evening reading.'
  },
  {
    id: 'high-contrast-charcoal',
    name: 'Midnight Warm Dark',
    backgroundColor: '#1E2024',
    textColor: '#F5EEDC',
    highlightColor: '#D97706',
    secondaryBg: '#2A2D33',
    borderColor: '#3F444E',
    description: 'Anti-glare charcoal night theme avoiding stark blue light.'
  }
];

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  font: 'Lexend',
  fontSize: 18,
  boldness: 450,
  letterSpacing: 0.05,
  wordSpacing: 0.12,
  lineSpacing: 1.85,
  paragraphSpacing: 1.5,
  textWidth: 68,
  alignment: 'left',
  
  themeId: 'warm-cream',
  backgroundColor: '#FEF9EB',
  textColor: '#26231E',
  highlightColor: '#FDE047',
  
  highlightMode: 'word',
  focusMode: false,
  readingRuler: false,
  rulerHeight: 80,
  spotlightDim: 0.4,
  
  confusableLetterSettings: {
    enabled: true,
    activePairs: ['b/d', 'p/q', 'm/w'],
    style: 'weight'
  },
  
  language: 'en-IN',
  audioLanguage: 'en-IN',
  ttsSpeed: 1.0,
  ttsVoice: '',
  autoScroll: true,
  bionicReading: false
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English (Indian)', nativeName: 'English (India)' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français' },
];
