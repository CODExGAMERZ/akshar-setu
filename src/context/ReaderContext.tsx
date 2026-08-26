'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfusablePair, DocumentItem, HighlightMode, ReadingProfile, SupportedLanguage } from '@/types';
import { DEFAULT_READING_PROFILE } from '@/lib/constants';
import { StorageService } from '@/lib/storage';
import { ProfileService } from '@/services/profile.service';
import { DocumentService } from '@/services/document.service';
import { TTSService } from '@/services/tts.service';
import { TranslationService } from '@/services/translation.service';
import { SimplificationService } from '@/services/simplification.service';

interface ReaderContextType {
  profile: ReadingProfile;
  updateProfile: (updates: Partial<ReadingProfile>) => void;
  resetProfile: () => void;
  saveAsGlobalSettings: () => void;
  saveForCurrentDocumentOnly: () => void;
  documents: DocumentItem[];
  currentDocument: DocumentItem | null;
  setCurrentDocumentId: (id: string) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'createdAt' | 'lastOpened' | 'progressPercent'>) => DocumentItem;
  deleteDocument: (id: string) => void;
  renameDocument: (id: string, newTitle: string) => void;
  viewMode: 'personalized' | 'original';
  setViewMode: (mode: 'personalized' | 'original') => void;
  simplifyLevel: 'off' | 'light' | 'medium' | 'heavy';
  setSimplifyLevel: (level: 'off' | 'light' | 'medium' | 'heavy') => Promise<void>;
  activeLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  isTranslating: boolean;
  isSimplifying: boolean;
  // TTS & Karaoke
  isPlayingAudio: boolean;
  activeWordIndex: number;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  startReadAloud: (fromWordIndex?: number) => void;
  stopReadAloud: () => void;
  pauseReadAloud: () => void;
  resumeReadAloud: () => void;
  replayReadAloud: () => void;
  // Focus & Reading Ruler
  readingRulerY: number;
  setReadingRulerY: (y: number) => void;
  focusMode: boolean;
  setFocusMode: (enabled: boolean) => void;
  // Confusable Letters
  confusableLettersEnabled: boolean;
  setConfusableLettersEnabled: (enabled: boolean) => void;
  confusablePairs: ConfusablePair[];
  toggleConfusablePair: (pair: ConfusablePair) => void;
  // Highlighting Mode
  highlightMode: HighlightMode;
  setHighlightMode: (mode: HighlightMode) => void;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export const ReaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<ReadingProfile>(DEFAULT_READING_PROFILE);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [currentDocument, setCurrentDocument] = useState<DocumentItem | null>(null);
  const [viewMode, setViewMode] = useState<'personalized' | 'original'>('personalized');
  const [simplifyLevel, setSimplifyLevelState] = useState<'off' | 'light' | 'medium' | 'heavy'>('off');
  const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isSimplifying, setIsSimplifying] = useState<boolean>(false);

  // TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const [speechRate, setSpeechRateState] = useState<number>(1.0);

  // Ruler & Focus State
  const [readingRulerY, setReadingRulerY] = useState<number>(200);
  const [focusMode, setFocusModeState] = useState<boolean>(false);

  // Confusable Letters & Highlighting
  const [confusableLettersEnabled, setConfusableLettersEnabledState] = useState<boolean>(false);
  const [confusablePairs, setConfusablePairs] = useState<ConfusablePair[]>(['bd', 'pq', 'mw']);
  const [highlightMode, setHighlightModeState] = useState<HighlightMode>('word');

  // Load initial data on mount
  useEffect(() => {
    const loadedDocs = DocumentService.getDocuments();
    setDocuments(loadedDocs);

    const activeDocId = StorageService.getCurrentDocId();
    const doc = loadedDocs.find((d) => d.id === activeDocId) || loadedDocs[0] || null;
    setCurrentDocument(doc);

    const loadedProfile = ProfileService.getEffectiveProfile(doc?.id);
    setProfileState(loadedProfile);
    setSpeechRateState(loadedProfile.ttsSpeed || 1.0);
    setFocusModeState(loadedProfile.focusModeEnabled || false);
    setConfusableLettersEnabledState(loadedProfile.confusableLettersEnabled || false);
    setConfusablePairs(loadedProfile.confusablePairs || ['bd', 'pq', 'mw']);
    setHighlightModeState(loadedProfile.highlightMode || 'word');

    if (doc) {
      setActiveLanguage(doc.language || 'en');
    }
  }, []);

  const updateProfile = (updates: Partial<ReadingProfile>) => {
    setProfileState((prev) => {
      const updated = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      ProfileService.saveProfile(updated);
      return updated;
    });
  };

  const saveAsGlobalSettings = () => {
    ProfileService.saveProfile(profile);
  };

  const saveForCurrentDocumentOnly = () => {
    if (!currentDocument) return;
    ProfileService.saveDocumentOverride(currentDocument.id, profile);
  };

  const resetProfile = () => {
    const def = ProfileService.resetToDefaults();
    setProfileState(def);
  };

  const setCurrentDocumentId = (id: string) => {
    const doc = documents.find((d) => d.id === id) || null;
    if (doc) {
      setCurrentDocument(doc);
      setActiveLanguage(doc.language || 'en');
      StorageService.setCurrentDocId(id);
      stopReadAloud();

      // Load document-specific profile if exists
      const effective = ProfileService.getEffectiveProfile(id);
      setProfileState(effective);
      setFocusModeState(effective.focusModeEnabled || false);
      setConfusableLettersEnabledState(effective.confusableLettersEnabled || false);
      setConfusablePairs(effective.confusablePairs || ['bd', 'pq', 'mw']);
      setHighlightModeState(effective.highlightMode || 'word');
    }
  };

  const addDocument = (
    docData: Omit<DocumentItem, 'id' | 'createdAt' | 'lastOpened' | 'progressPercent'>
  ): DocumentItem => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastOpened: 'Just now',
      progressPercent: 0,
    };
    DocumentService.saveDocument(newDoc);
    const updatedList = DocumentService.getDocuments();
    setDocuments(updatedList);
    setCurrentDocument(newDoc);
    StorageService.setCurrentDocId(newDoc.id);
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    DocumentService.deleteDocument(id);
    const remaining = DocumentService.getDocuments();
    setDocuments(remaining);
    if (currentDocument?.id === id) {
      setCurrentDocument(remaining[0] || null);
    }
  };

  const renameDocument = (id: string, newTitle: string) => {
    DocumentService.renameDocument(id, newTitle);
    const updatedList = DocumentService.getDocuments();
    setDocuments(updatedList);
    if (currentDocument?.id === id) {
      setCurrentDocument({ ...currentDocument, title: newTitle });
    }
  };

  const setLanguage = async (lang: SupportedLanguage) => {
    if (lang === activeLanguage && currentDocument?.language === lang) return;
    setActiveLanguage(lang);
    setViewMode('personalized');
    setSimplifyLevelState('off');
    stopReadAloud();

    if (!currentDocument) return;

    setIsTranslating(true);
    try {
      const translated = await TranslationService.translateText(
        currentDocument.originalText,
        lang,
        currentDocument.title
      );

      const updatedDoc: DocumentItem = {
        ...currentDocument,
        processedText: translated,
        language: lang,
      };

      setCurrentDocument(updatedDoc);
      DocumentService.saveDocument(updatedDoc);
      setDocuments((prevDocs) =>
        prevDocs.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
      );
    } catch (err) {
      console.error('Failed to change language:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const setSimplifyLevel = async (level: 'off' | 'light' | 'medium' | 'heavy') => {
    setSimplifyLevelState(level);
    setViewMode('personalized');
    stopReadAloud();

    if (!currentDocument) return;

    if (level === 'off') {
      setIsSimplifying(true);
      try {
        const baseText =
          activeLanguage === 'en'
            ? currentDocument.originalText
            : await TranslationService.translateText(
                currentDocument.originalText,
                activeLanguage,
                currentDocument.title
              );

        const updatedDoc = {
          ...currentDocument,
          processedText: baseText,
        };
        setCurrentDocument(updatedDoc);
        DocumentService.saveDocument(updatedDoc);
        setDocuments((prevDocs) =>
          prevDocs.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
        );
      } finally {
        setIsSimplifying(false);
      }
      return;
    }

    setIsSimplifying(true);
    try {
      const sourceText =
        activeLanguage === 'en'
          ? currentDocument.originalText
          : currentDocument.processedText || currentDocument.originalText;

      const simplified = await SimplificationService.simplifyText(
        sourceText,
        level,
        currentDocument.title
      );

      const updatedDoc: DocumentItem = {
        ...currentDocument,
        processedText: simplified,
      };

      setCurrentDocument(updatedDoc);
      DocumentService.saveDocument(updatedDoc);
      setDocuments((prevDocs) =>
        prevDocs.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
      );
    } catch (err) {
      console.error('Failed to simplify text:', err);
    } finally {
      setIsSimplifying(false);
    }
  };

  // TTS Read Aloud Handlers
  const startReadAloud = (fromWordIndex: number = 0) => {
    if (!currentDocument) return;
    const fullText = viewMode === 'original' ? currentDocument.originalText : currentDocument.processedText;
    const allWords = fullText.split(/\s+/).filter(Boolean);

    let textToRead = fullText;
    let baseOffset = 0;

    if (fromWordIndex > 0 && fromWordIndex < allWords.length) {
      textToRead = allWords.slice(fromWordIndex).join(' ');
      baseOffset = fromWordIndex;
    }

    setIsPlayingAudio(true);
    setActiveWordIndex(baseOffset);

    TTSService.speak(textToRead, activeLanguage, speechRate, {
      onStart: () => {
        setIsPlayingAudio(true);
        setActiveWordIndex(baseOffset);
      },
      onWord: (wordIdx) => {
        setActiveWordIndex(baseOffset + wordIdx);
      },
      onEnd: () => {
        setIsPlayingAudio(false);
        setActiveWordIndex(-1);
      },
      onError: (err) => {
        console.warn('Speech synthesis ended or interrupted:', err);
        setIsPlayingAudio(false);
        setActiveWordIndex(-1);
      },
    });
  };

  const stopReadAloud = () => {
    TTSService.stop();
    setIsPlayingAudio(false);
    setActiveWordIndex(-1);
  };

  const pauseReadAloud = () => {
    TTSService.pause();
    setIsPlayingAudio(false);
  };

  const resumeReadAloud = () => {
    TTSService.resume();
    setIsPlayingAudio(true);
  };

  const replayReadAloud = () => {
    stopReadAloud();
    setTimeout(() => {
      startReadAloud(0);
    }, 100);
  };

  const setSpeechRate = (rate: number) => {
    setSpeechRateState(rate);
    updateProfile({ ttsSpeed: rate });
    if (isPlayingAudio) {
      // Re-trigger with new rate seamlessly from current word
      const currentIdx = Math.max(0, activeWordIndex);
      startReadAloud(currentIdx);
    }
  };

  const setFocusMode = (enabled: boolean) => {
    setFocusModeState(enabled);
    updateProfile({ focusModeEnabled: enabled });
  };

  const setConfusableLettersEnabled = (enabled: boolean) => {
    setConfusableLettersEnabledState(enabled);
    updateProfile({ confusableLettersEnabled: enabled });
  };

  const toggleConfusablePair = (pair: ConfusablePair) => {
    const updated = confusablePairs.includes(pair)
      ? confusablePairs.filter((p) => p !== pair)
      : [...confusablePairs, pair];
    setConfusablePairs(updated);
    updateProfile({ confusablePairs: updated });
  };

  const setHighlightMode = (mode: HighlightMode) => {
    setHighlightModeState(mode);
    updateProfile({ highlightMode: mode });
  };

  return (
    <ReaderContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
        saveAsGlobalSettings,
        saveForCurrentDocumentOnly,
        documents,
        currentDocument,
        setCurrentDocumentId,
        addDocument,
        deleteDocument,
        renameDocument,
        viewMode,
        setViewMode,
        simplifyLevel,
        setSimplifyLevel,
        activeLanguage,
        setLanguage,
        isTranslating,
        isSimplifying,
        isPlayingAudio,
        activeWordIndex,
        speechRate,
        setSpeechRate,
        startReadAloud,
        stopReadAloud,
        pauseReadAloud,
        resumeReadAloud,
        replayReadAloud,
        readingRulerY,
        setReadingRulerY,
        focusMode,
        setFocusMode,
        confusableLettersEnabled,
        setConfusableLettersEnabled,
        confusablePairs,
        toggleConfusablePair,
        highlightMode,
        setHighlightMode,
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
};

export const useReader = (): ReaderContextType => {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return context;
};
