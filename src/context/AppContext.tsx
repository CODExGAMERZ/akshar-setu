'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  AppRoute, 
  Document, 
  ReadingPreferences, 
  ReadingProfile, 
  TTSState, 
  User, 
  ActiveViewMode, 
  CalibrationResult 
} from '../types';

import { DEFAULT_READING_PREFERENCES } from '../data/themes';
import { documentService } from '../services/documentService';
import { profileService } from '../services/profileService';
import { ttsService } from '../services/ttsService';
import { translationService } from '../services/translationService';
import { calibrationService } from '../services/calibrationService';
import { readingService } from '../services/readingService';

export interface AppContextType {
  // Navigation & UI State
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  navigateToReader: (documentId: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isControlsDrawerOpen: boolean;
  setIsControlsDrawerOpen: (open: boolean) => void;

  // User State
  currentUser: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;

  // Documents State
  documents: Document[];
  activeDocument: Document | null;
  activePageNumber: number;
  setActivePageNumber: (page: number) => void;
  viewMode: ActiveViewMode;
  setViewMode: (mode: ActiveViewMode) => void;
  refreshDocuments: () => Promise<void>;
  selectDocument: (id: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateDocumentCategory: (docId: string, category: string) => Promise<void>;
  uploadAndDigitise: (file: File) => Promise<Document>;
  updateDocumentProgress: (docId: string, progress: number) => Promise<void>;

  // Reading Preferences State
  preferences: ReadingPreferences;
  updatePreferences: (updates: Partial<ReadingPreferences>, isDocumentOnly?: boolean) => void;
  saveAsGlobalPreferences: () => Promise<void>;
  saveForThisDocumentOnly: () => Promise<void>;
  resetToCalibratedSettings: () => Promise<void>;
  resetToDefaultSettings: () => Promise<void>;

  // Profile
  profile: ReadingProfile | null;
  saveProfileChanges: (profile: ReadingProfile) => Promise<void>;

  // Calibration State
  applyCalibrationResult: (result: CalibrationResult) => Promise<void>;

  // TTS & Read-Along State
  ttsState: TTSState;
  startTTS: (textToSpeak?: string, startWordOffset?: number) => void;
  pauseTTS: () => void;
  resumeTTS: () => void;
  stopTTS: () => void;
  setTTSSpeed: (speed: number) => void;
  setTTSVoice: (voiceName: string) => void;
  seekToWord: (wordIndex: number) => void;

  // Translation State
  currentLanguage: string;
  isTranslating: boolean;
  changeReadingLanguage: (langCode: string) => Promise<void>;
  activeTranslatedText: string | null;
  translationNotice: string | null;

  // Modals & Popups
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isAssessmentModalOpen: boolean;
  setIsAssessmentModalOpen: (open: boolean) => void;
  isSimplificationModalOpen: boolean;
  setIsSimplificationModalOpen: (open: boolean) => void;
  isSessionSummaryOpen: boolean;
  setIsSessionSummaryOpen: (open: boolean) => void;
  isHowItWorksOpen: boolean;
  setIsHowItWorksOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);
const USER_STORAGE_KEY = 'aksharsetu_user_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentRoute, setCurrentRouteState] = useState<AppRoute>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isControlsDrawerOpen, setIsControlsDrawerOpen] = useState<boolean>(false);

  // User
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Documents
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ActiveViewMode>('personalized');

  // Preferences & Profile
  const [preferences, setPreferences] = useState<ReadingPreferences>(DEFAULT_READING_PREFERENCES);
  const [profile, setProfile] = useState<ReadingProfile | null>(null);

  // TTS
  const [ttsState, setTtsState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentWordIndex: -1,
    currentSentenceIndex: 0,
    totalWords: 0,
    activeWordText: '',
    playbackRate: 1.0,
    voiceName: '',
    isSupported: true
  });

  // Translation
  const [currentLanguage, setCurrentLanguage] = useState<string>('en-IN');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [activeTranslatedText, setActiveTranslatedText] = useState<string | null>(null);
  const [translationNotice, setTranslationNotice] = useState<string | null>(null);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isSimplificationModalOpen, setIsSimplificationModalOpen] = useState(false);
  const [isSessionSummaryOpen, setIsSessionSummaryOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Synchronize route on Next.js pathname changes
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/library')) {
      setCurrentRouteState('library');
    } else if (pathname.startsWith('/read') || pathname.startsWith('/reader')) {
      setCurrentRouteState('reader');
    } else if (pathname.startsWith('/calibrate')) {
      setCurrentRouteState('calibration');
    } else if (pathname.startsWith('/profile')) {
      setCurrentRouteState('profile');
    } else if (pathname.startsWith('/login')) {
      setCurrentRouteState('login');
    } else {
      setCurrentRouteState('landing');
    }
  }, [pathname]);

  const setCurrentRoute = useCallback((route: AppRoute) => {
    setCurrentRouteState(route);
    const pathMap: Record<AppRoute, string> = {
      landing: '/',
      library: '/library',
      reader: '/reader',
      calibration: '/calibrate',
      profile: '/profile',
      login: '/login',
      assessment: '/calibrate'
    };
    const targetPath = pathMap[route] || '/';
    if (pathname !== targetPath) {
      router.push(targetPath);
    }
  }, [pathname, router]);


  // Initial Load
  useEffect(() => {
    async function init() {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn('Failed to hydrate user from storage:', e);
      }

      const docs = await documentService.getDocuments();
      setDocuments(docs);
      if (docs.length > 0) {
        setActiveDocument(docs[0]);
      }

      const prof = await profileService.getProfile();
      setProfile(prof);
      if (prof && prof.preferences) {
        setPreferences(prof.preferences);
      }
    }
    init();
  }, []);

  // Update preferences reactively
  const updatePreferences = useCallback((updates: Partial<ReadingPreferences>, isDocumentOnly = false) => {
    setPreferences(prev => {
      const next = { ...prev, ...updates };
      if (!isDocumentOnly) {
        profileService.updatePreferences(next);
      }
      return next;
    });

    if (isDocumentOnly && activeDocument) {
      setActiveDocument(prev => {
        if (!prev) return null;
        const updated = {
          ...prev,
          customPreferences: {
            ...(prev.customPreferences || {}),
            ...updates
          }
        };
        documentService.saveDocument(updated);
        return updated;
      });
    }
  }, [activeDocument]);

  const saveAsGlobalPreferences = useCallback(async () => {
    if (profile) {
      const updated = {
        ...profile,
        preferences: { ...preferences }
      };
      await profileService.saveProfile(updated);
      setProfile(updated);
    }
  }, [profile, preferences]);

  const saveForThisDocumentOnly = useCallback(async () => {
    if (activeDocument) {
      const updated = {
        ...activeDocument,
        customPreferences: { ...preferences }
      };
      await documentService.saveDocument(updated);
      setActiveDocument(updated);
      setDocuments(prev => prev.map(d => d.id === updated.id ? updated : d));
    }
  }, [activeDocument, preferences]);

  const resetToCalibratedSettings = useCallback(async () => {
    const calibrated = await profileService.resetToCalibrated();
    setPreferences(calibrated);
  }, []);

  const resetToDefaultSettings = useCallback(async () => {
    const def = await profileService.resetToDefaults();
    setPreferences(def);
  }, []);

  const saveProfileChanges = useCallback(async (newProfile: ReadingProfile) => {
    const saved = await profileService.saveProfile(newProfile);
    setProfile(saved);
    setPreferences(saved.preferences);
  }, []);

  const applyCalibrationResult = useCallback(async (result: CalibrationResult) => {
    await calibrationService.saveResult(result);
    if (profile) {
      const answersRecord: Record<string, string> = {};
      Object.entries(result.roundSelections).forEach(([k, v]) => {
        answersRecord[k] = v;
      });
      const updated = await profileService.saveCalibratedProfile(result.generatedPreferences, answersRecord);
      setProfile(updated);
      setPreferences(result.generatedPreferences);
    }
  }, [profile]);

  // Documents
  const refreshDocuments = useCallback(async () => {
    const docs = await documentService.getDocuments();
    setDocuments(docs);
  }, []);

  const selectDocument = useCallback(async (id: string) => {
    ttsService.stop();
    setTtsState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentWordIndex: -1 }));
    const doc = await documentService.getDocument(id);
    if (doc) {
      setActiveDocument(doc);
      setActivePageNumber(1);
      setActiveTranslatedText(null);
      setCurrentLanguage(doc.language || 'en-IN');
      
      // If doc has custom preferences override, apply it; otherwise fallback to global profile
      if (doc.customPreferences && Object.keys(doc.customPreferences).length > 0) {
        setPreferences(prev => ({ ...prev, ...doc.customPreferences }));
      } else if (profile?.preferences) {
        setPreferences(profile.preferences);
      }

      // Start session metric tracking
      readingService.startSession(doc.id, doc.totalWords);
    }
  }, [profile]);

  const navigateToReader = useCallback((documentId: string) => {
    selectDocument(documentId);
    router.push(`/read/${documentId}`);
  }, [selectDocument, router]);


  const deleteDocument = useCallback(async (id: string) => {
    await documentService.deleteDocument(id);
    setDocuments(prev => {
      const remaining = prev.filter(d => d.id !== id);
      if (activeDocument?.id === id) {
        if (remaining.length > 0) {
          selectDocument(remaining[0].id);
        } else {
          setActiveDocument(null);
        }
      }
      return remaining;
    });
  }, [activeDocument, selectDocument]);

  const updateDocumentCategory = useCallback(async (docId: string, category: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      const updated = { ...doc, category };
      await documentService.saveDocument(updated);
      setDocuments(prev => prev.map(d => d.id === docId ? updated : d));
      if (activeDocument?.id === docId) {
        setActiveDocument(updated);
      }
    }
  }, [documents, activeDocument]);

  const uploadAndDigitise = useCallback(async (file: File): Promise<Document> => {
    const newDoc = await documentService.digitise(file);
    await refreshDocuments();
    await selectDocument(newDoc.id);
    return newDoc;
  }, [refreshDocuments, selectDocument]);

  const updateDocumentProgress = useCallback(async (docId: string, progress: number) => {
    await documentService.updateProgress(docId, progress);
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, progressPercent: progress } : d));
    if (activeDocument?.id === docId) {
      setActiveDocument(prev => prev ? { ...prev, progressPercent: progress } : null);
    }
  }, [activeDocument]);

  // Auth
  const loginUser = useCallback((user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist user session:', e);
    }
    setCurrentRoute('library');
  }, [setCurrentRoute]);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear user session:', e);
    }
    setCurrentRoute('landing');
  }, [setCurrentRoute]);

  // Text-To-Speech
  const getCurrentPageText = useCallback(() => {
    if (activeTranslatedText) return activeTranslatedText;
    if (!activeDocument) return '';
    const page = activeDocument.pages.find(p => p.pageNumber === activePageNumber) || activeDocument.pages[0];
    return page?.content || '';
  }, [activeDocument, activePageNumber, activeTranslatedText]);

  const startTTS = useCallback((textToSpeak?: string, startWordOffset = 0) => {
    const fullPageContent = getCurrentPageText();
    const content = textToSpeak || fullPageContent;
    if (!content) return;

    const allPageWords = fullPageContent.match(/\S+/g) || [];
    setTtsState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      currentWordIndex: startWordOffset,
      totalWords: allPageWords.length > 0 ? allPageWords.length : (content.match(/\S+/g) || []).length,
      playbackRate: preferences.ttsSpeed
    }));

    ttsService.speak(content, {
      rate: preferences.ttsSpeed,
      lang: preferences.audioLanguage || currentLanguage || 'en-IN',
      voiceName: preferences.ttsVoice,
      onEngineDetermined: (engine) => {
        setTtsState(prev => ({ ...prev, activeEngine: engine }));
      },
      onWordBoundary: (wordIdx, _, word) => {
        const absoluteWordIndex = startWordOffset + wordIdx;
        setTtsState(prev => ({
          ...prev,
          currentWordIndex: absoluteWordIndex,
          activeWordText: word
        }));
        readingService.recordWordRead(1);

        // Auto-scroll handler if active
        if (preferences.autoScroll) {
          const activeEl = document.getElementById(`word-span-${absoluteWordIndex}`);
          if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      },
      onEnd: () => {
        setTtsState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentWordIndex: -1,
          activeWordText: '',
          activeEngine: 'none'
        }));
      },
      onError: (err) => {
        console.warn('TTS playback issue:', err);
        setTtsState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          activeEngine: 'none'
        }));
      }
    });
  }, [getCurrentPageText, preferences.ttsSpeed, preferences.audioLanguage, preferences.ttsVoice, preferences.autoScroll, currentLanguage]);

  const pauseTTS = useCallback(() => {
    ttsService.pause();
    setTtsState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
  }, []);

  const resumeTTS = useCallback(() => {
    ttsService.resume();
    setTtsState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
  }, []);

  const stopTTS = useCallback(() => {
    ttsService.stop();
    setTtsState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: false, 
      currentWordIndex: -1, 
      activeWordText: '',
      activeEngine: 'none'
    }));
  }, []);

  // Stop TTS automatically whenever page changes
  useEffect(() => {
    if (ttsState.isPlaying) {
      stopTTS();
    }
  }, [activePageNumber]);

  const setTTSSpeed = useCallback((speed: number) => {
    updatePreferences({ ttsSpeed: speed });
    ttsService.setRate(speed);
    setTtsState(prev => ({ ...prev, playbackRate: speed }));
  }, [updatePreferences]);

  const setTTSVoice = useCallback((voiceName: string) => {
    updatePreferences({ ttsVoice: voiceName });
    setTtsState(prev => ({ ...prev, voiceName }));
  }, [updatePreferences]);

  const seekToWord = useCallback((wordIndex: number) => {
    const fullText = getCurrentPageText();
    const words = fullText.match(/\S+/g) || [];
    const remainingText = words.slice(wordIndex).join(' ');
    startTTS(remainingText, wordIndex);
  }, [getCurrentPageText, startTTS]);

  // Translation
  const changeReadingLanguage = useCallback(async (targetLang: string) => {
    if (!activeDocument) return;
    setIsTranslating(true);
    setCurrentLanguage(targetLang);
    try {
      const page = activeDocument.pages.find(p => p.pageNumber === activePageNumber) || activeDocument.pages[0];
      if (!page) return;

      if (targetLang === activeDocument.language) {
        setActiveTranslatedText(null);
        setTranslationNotice(null);
      } else if (page.translations && page.translations[targetLang]) {
        // Cached instant translation
        setActiveTranslatedText(page.translations[targetLang]);
        setTranslationNotice(null);
      } else {
        const res = await translationService.translate(page.content, activeDocument.language, targetLang);
        if (res.translatedText && res.translatedText.trim() !== page.content.trim()) {
          setActiveTranslatedText(res.translatedText);
          setTranslationNotice(null);
        } else {
          setActiveTranslatedText(null);
          setTranslationNotice('Translation unavailable for this page — showing original text');
        }
      }
    } catch (e) {
      console.warn('Translation failed:', e);
      setActiveTranslatedText(null);
      setTranslationNotice('Translation unavailable — showing original text');
    } finally {
      setIsTranslating(false);
    }
  }, [activeDocument, activePageNumber]);

  // Retrigger translation on page change when a non-native language is active
  useEffect(() => {
    if (!activeDocument) return;
    if (currentLanguage && currentLanguage !== activeDocument.language) {
      changeReadingLanguage(currentLanguage);
    } else {
      setActiveTranslatedText(null);
      setTranslationNotice(null);
    }
  }, [activePageNumber, activeDocument?.id, currentLanguage, changeReadingLanguage]);

  const value = useMemo(() => ({
    currentRoute,
    setCurrentRoute,
    navigateToReader,
    isSidebarOpen,
    setIsSidebarOpen,
    isControlsDrawerOpen,
    setIsControlsDrawerOpen,
    currentUser,
    loginUser,
    logoutUser,
    documents,
    activeDocument,
    activePageNumber,
    setActivePageNumber,
    viewMode,
    setViewMode,
    refreshDocuments,
    selectDocument,
    deleteDocument,
    updateDocumentCategory,
    uploadAndDigitise,
    updateDocumentProgress,
    preferences,
    updatePreferences,
    saveAsGlobalPreferences,
    saveForThisDocumentOnly,
    resetToCalibratedSettings,
    resetToDefaultSettings,
    profile,
    saveProfileChanges,
    applyCalibrationResult,
    ttsState,
    startTTS,
    pauseTTS,
    resumeTTS,
    stopTTS,
    setTTSSpeed,
    setTTSVoice,
    seekToWord,
    currentLanguage,
    isTranslating,
    changeReadingLanguage,
    activeTranslatedText,
    translationNotice,
    isUploadModalOpen,
    setIsUploadModalOpen,
    isAssessmentModalOpen,
    setIsAssessmentModalOpen,
    isSimplificationModalOpen,
    setIsSimplificationModalOpen,
    isSessionSummaryOpen,
    setIsSessionSummaryOpen,
    isHowItWorksOpen,
    setIsHowItWorksOpen
  }), [
    currentRoute,
    setCurrentRoute,
    navigateToReader,
    isSidebarOpen,
    isControlsDrawerOpen,
    currentUser,
    loginUser,
    logoutUser,
    documents,
    activeDocument,
    activePageNumber,
    viewMode,
    refreshDocuments,
    selectDocument,
    deleteDocument,
    updateDocumentCategory,
    uploadAndDigitise,
    updateDocumentProgress,
    preferences,
    updatePreferences,
    saveAsGlobalPreferences,
    saveForThisDocumentOnly,
    resetToCalibratedSettings,
    resetToDefaultSettings,
    profile,
    saveProfileChanges,
    applyCalibrationResult,
    ttsState,
    startTTS,
    pauseTTS,
    resumeTTS,
    stopTTS,
    setTTSSpeed,
    setTTSVoice,
    seekToWord,
    currentLanguage,
    isTranslating,
    changeReadingLanguage,
    activeTranslatedText,
    translationNotice,
    isUploadModalOpen,
    isAssessmentModalOpen,
    isSimplificationModalOpen,
    isSessionSummaryOpen,
    isHowItWorksOpen
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
