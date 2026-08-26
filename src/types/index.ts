export type FontFamily =
  | 'Open Sans'
  | 'Arial'
  | 'Verdana'
  | 'Tahoma'
  | 'Century Gothic'
  | 'Calibri'
  | 'OpenDyslexic'
  | 'Lexend'
  | 'Atkinson Hyperlegible';

export type ThemePreset =
  | 'warm-cream'
  | 'soft-peach'
  | 'mint-tint'
  | 'high-contrast-dark'
  | 'standard-white';

export interface ReadingProfile {
  id: string;
  userId?: string | null;
  fontFamily: FontFamily;
  fontSize: number; // in px, default 18
  fontWeight: 400 | 700;
  lineHeight: number; // multiplier e.g. 1.5, 1.8, 2.0
  letterSpacing: number; // in em e.g. 0.03, 0.06, 0.1
  wordSpacing: number; // in em e.g. 0.12, 0.25, 0.4
  paragraphSpacing: number; // in px e.g. 24, 32, 40
  backgroundColor: string; // e.g. '#fbf9f8'
  textColor: string; // e.g. '#1b1c1c'
  themePreset: ThemePreset;
  textAlign: 'left' | 'justify';
  maxCharactersPerLine: number; // 60-70 chars
  readingRulerEnabled: boolean;
  readingRulerHeight: number; // in px e.g. 40
  syllableHighlighting: boolean;
  simplifyLevel: 'off' | 'light' | 'medium' | 'heavy';
  createdAt?: string;
  updatedAt?: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'or' | 'bn' | 'ta' | 'te' | 'mr';

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
  translations?: Record<SupportedLanguage, string>;
  language: SupportedLanguage;
  sourceFormat: 'pdf' | 'text';
  lastOpened: string;
  progressPercent: number;
  wordCount: number;
  createdAt: string;
}

export interface CalibrationStep {
  id: number;
  title: string;
  description: string;
  variableTested: 'font' | 'lineSpacing' | 'letterSpacing' | 'wordSpacing' | 'backgroundColor' | 'contrast' | 'fontWeight' | 'textWidth';
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
