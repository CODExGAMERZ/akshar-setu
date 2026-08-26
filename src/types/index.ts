export type FontOption = 'Lexend' | 'Atkinson Hyperlegible' | 'OpenDyslexic' | 'Comic Neue' | 'Arial' | 'Verdana' | 'Lora';

export type HighlightMode = 'none' | 'word' | 'phrase' | 'line' | 'selective';

export type ConfusablePair = 'b/d' | 'p/q' | 'm/w' | 'n/u' | 's/z';

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'ml' | 'pa' | 'or' | 'es' | 'fr' | string;


export interface ConfusableSettings {
  enabled: boolean;
  activePairs: ConfusablePair[];
  style: 'weight' | 'subtle-color' | 'underline' | 'dot';
}

export interface ReadingTheme {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  highlightColor: string;
  secondaryBg: string;
  borderColor: string;
  description: string;
}

export interface ReadingPreferences {
  font: FontOption;
  fontSize: number; // in px (14 - 36)
  boldness: number; // 400 - 800
  letterSpacing: number; // in em (0 - 0.25)
  wordSpacing: number; // in em (0 - 0.5)
  lineSpacing: number; // line-height multiplier (1.4 - 2.8)
  paragraphSpacing: number; // in rem (0.75 - 2.5)
  textWidth: number; // in ch (45 - 85)
  alignment: 'left' | 'justify';
  
  // Colors
  themeId: string;
  backgroundColor: string;
  textColor: string;
  highlightColor: string;
  
  // Highlight & Focus
  highlightMode: HighlightMode;
  focusMode: boolean;
  readingRuler: boolean;
  rulerHeight: number; // in px (40 - 160)
  spotlightDim: number; // opacity (0.2 - 0.8)
  
  // Confusable Letters
  confusableLetterSettings: ConfusableSettings;
  
  // Audio & TTS
  language: string;
  audioLanguage: string;
  ttsSpeed: number; // 0.5 - 2.0
  ttsVoice: string;
  autoScroll: boolean;
  bionicReading: boolean; // subtle initial fixations toggle
}

export interface ReadingProfile {
  id: string;
  userId: string;
  name: string;
  preferences: ReadingPreferences;
  calibratedAt?: string;
  calibrationAnswers?: Record<string, string>;
  assessmentDocumentName?: string;
  assessmentExtractedNotes?: string[];
  updatedAt: string;
}

export interface DocumentPage {
  pageNumber: number;
  content: string;
  paragraphs: string[];
  simplifiedContent?: string;
  translations?: Record<string, string>;
  imageBanner?: string;
  diagramTitle?: string;
  keyTerms?: Array<{ term: string; definition: string }>;
}

export interface Document {
  id: string;
  title: string;
  category: 'Science' | 'History' | 'English' | 'Mathematics' | 'General' | string;
  language: string;
  createdAt: string;
  updatedAt: string;
  progressPercent: number;
  totalWords: number;
  estimatedReadTimeMinutes: number;
  thumbnailUrl?: string;
  pages: DocumentPage[];
  originalViewStyle?: {
    headerColor: string;
    chapterNumber: string;
    subheading: string;
    accentColor: string;
  };
  customPreferences?: Partial<ReadingPreferences>; // per-document override
  status: 'completed' | 'processing' | 'error';
}

export interface CalibrationOption {
  id: string;
  title: string;
  description: string;
  previewSettings: Partial<ReadingPreferences>;
  badge?: string;
}

export interface CalibrationRound {
  id: number;
  title: string;
  subtitle: string;
  roundType: 'typography' | 'spacing' | 'theme' | 'highlighting' | 'comparison';
  sampleText: string;
  options: CalibrationOption[];
}

export interface CalibrationResult {
  roundSelections: Record<number, string>;
  generatedPreferences: ReadingPreferences;
  completedAt: string;
}

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentWordIndex: number;
  currentSentenceIndex: number;
  totalWords: number;
  activeWordText: string;
  playbackRate: number;
  voiceName: string;
  isSupported: boolean;
}

export interface ReadingSession {
  documentId: string;
  startTime: number;
  elapsedSeconds: number;
  wordsRead: number;
  wpm: number;
  difficultWordsLookedUp: string[];
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'educator' | 'parent';
  createdAt: string;
}

export type ActiveViewMode = 'original' | 'personalized';
export type AppRoute = 'landing' | 'library' | 'reader' | 'calibration' | 'profile' | 'login' | 'assessment';
