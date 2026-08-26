export type FontFamily =
  // Purpose-built Dyslexia Fonts
  | 'OpenDyslexic'
  | 'Dyslexie'
  | 'Read Regular'
  | 'Sylexiad'
  | 'Lexend'
  | 'Atkinson Hyperlegible'
  // Dyslexia-Friendly Standard Sans-Serif Fonts
  | 'Arial'
  | 'Tahoma'
  | 'Verdana'
  | 'Trebuchet MS'
  | 'Helvetica'
  | 'Open Sans'
  | 'Century Gothic'
  | 'Calibri'
  | 'Comic Sans MS'
  | 'Inter'
  | 'Roboto'
  | 'Lato'
  | 'Nunito'
  | 'Nunito Sans'
  | 'Source Sans 3'
  | 'Ubuntu'
  | 'PT Sans';

export type FontCategory =
  | 'purpose-built'
  | 'accessibility-focused'
  | 'humanist-sans'
  | 'standard-system';

export interface FontOption {
  id: FontFamily;
  name: string;
  category: FontCategory;
  categoryLabel: string;
  description: string;
  cssFamily: string;
}

export type ThemePreset =
  | 'warm-cream'
  | 'f4f1ea-cream'
  | 'soft-yellow'
  | 'soft-peach'
  | 'mint-tint'
  | 'soft-blue'
  | 'high-contrast-dark'
  | 'yellow-on-black'
  | 'standard-white'
  | 'custom';

export type HighlightMode =
  | 'none'
  | 'word'
  | 'phrase'
  | 'line'
  | 'selective';

export type ConfusablePair = 'bd' | 'pq' | 'mw';

export interface CustomThemeConfig {
  backgroundColor: string;
  textColor: string;
  highlightColor: string;
}

export interface ReadingProfile {
  id: string;
  userId?: string | null;
  fontFamily: FontFamily;
  fontSize: number; // in px, minimum 16, default 18
  fontWeight: 400 | 700;
  lineHeight: number; // multiplier e.g. 1.5, 1.6, 1.8, 2.0 (WCAG min 1.5)
  letterSpacing: number; // in em e.g. 0.04, 0.12 (WCAG benchmark 0.12)
  wordSpacing: number; // in em e.g. 0.16, 0.25 (WCAG benchmark 0.16)
  paragraphSpacing: number; // in px e.g. 24, 32, 40
  backgroundColor: string; // e.g. '#fbf9f8'
  textColor: string; // e.g. '#1b1c1c'
  highlightColor?: string; // e.g. '#fdbe54'
  themePreset: ThemePreset;
  customColors?: CustomThemeConfig;
  textAlign: 'left'; // Strictly left-aligned
  maxCharactersPerLine: number; // 45-100 chars (default 65)
  readingRulerEnabled: boolean;
  readingRulerHeight: number; // in px e.g. 44
  syllableHighlighting: boolean;
  highlightMode: HighlightMode;
  confusableLettersEnabled: boolean;
  confusablePairs: ConfusablePair[];
  focusModeEnabled: boolean;
  simplifyLevel: 'off' | 'light' | 'medium' | 'heavy';
  preferredReadingLanguage: SupportedLanguage;
  preferredAudioLanguage: SupportedLanguage;
  ttsSpeed: number;
  ttsVoice?: string;
  documentSpecificOverrides?: Record<string, Partial<ReadingProfile>>;
  createdAt?: string;
  updatedAt?: string;
}

export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'bn'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'mr'
  | 'or'
  | 'pa'
  | 'ta'
  | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  voiceName?: string;
  direction?: 'ltr' | 'rtl';
}

export interface DocumentItem {
  id: string;
  title: string;
  originalText: string;
  processedText: string;
  simplifiedText?: {
    light?: string;
    medium?: string;
    heavy?: string;
  };
  translations?: Partial<Record<SupportedLanguage, string>>;
  language: SupportedLanguage;
  sourceFormat: 'pdf' | 'text' | 'image';
  lastOpened: string;
  progressPercent: number;
  wordCount: number;
  createdAt: string;
  summary?: string;
}

export interface DocumentPage {
  pageNumber: number;
  text: string;
  imageUrl?: string;
}

export interface CalibrationStep {
  id: number;
  roundNumber: number;
  title: string;
  description: string;
  variableTested:
    | 'font'
    | 'lineSpacing'
    | 'letterSpacing'
    | 'wordSpacing'
    | 'backgroundColor'
    | 'contrast'
    | 'fontWeight'
    | 'textWidth'
    | 'highlighting';
  sampleA: {
    label: string;
    text: string;
    style: Partial<ReadingProfile>;
    icon: string;
  };
  sampleB: {
    label: string;
    text: string;
    style: Partial<ReadingProfile>;
    icon: string;
  };
}

export interface CalibrationChoice {
  stepId: number;
  roundNumber?: number;
  choice: 'A' | 'B' | 'SAME';
}

export interface CalibrationResult {
  completedAt: string;
  recommendedProfile: ReadingProfile;
  choices: CalibrationChoice[];
}

export interface ReadingSession {
  sessionId: string;
  documentId: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  wordsRead: number;
  readingSpeedWpm: number;
  confusableLetterInteractionsCount: number;
}

export interface UserSession {
  isGuest: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  } | null;
}

export type AIProvider = 'server-default' | 'gemini' | 'openai' | 'groq' | 'sarvam';

export interface UserApiConfig {
  provider: AIProvider;
  geminiKey?: string;
  openaiKey?: string;
  groqKey?: string;
  sarvamKey?: string;
  useCustomKey: boolean;
}
