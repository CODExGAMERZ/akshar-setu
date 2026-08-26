'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DocumentItem, ReadingProfile, SupportedLanguage } from '@/types';
import { DEFAULT_READING_PROFILE } from '@/lib/constants';
import { StorageService } from '@/lib/storage';
import { TTSService } from '@/services/tts.service';
import { TranslationService } from '@/services/translation.service';
import { SimplificationService } from '@/services/simplification.service';

interface ReaderContextType {
  profile: ReadingProfile;
  updateProfile: (updates: Partial<ReadingProfile>) => void;
  resetProfile: () => void;
  documents: DocumentItem[];
  currentDocument: DocumentItem | null;
  setCurrentDocumentId: (id: string) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'createdAt' | 'lastOpened' | 'progressPercent'>) => DocumentItem;
  deleteDocument: (id: string) => void;
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
  startReadAloud: () => void;
  stopReadAloud: () => void;
  pauseReadAloud: () => void;
  resumeReadAloud: () => void;
  // Focus & Reading Ruler
  readingRulerY: number;
  setReadingRulerY: (y: number) => void;
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
  const [speechRate, setSpeechRate] = useState<number>(0.95);

  // Ruler state
  const [readingRulerY, setReadingRulerY] = useState<number>(200);

  // Load initial data on mount
  useEffect(() => {
    const loadedProfile = StorageService.getProfile();
    setProfileState(loadedProfile);

    const loadedDocs = StorageService.getDocuments();
    setDocuments(loadedDocs);

    const activeDocId = StorageService.getCurrentDocId();
    const doc = loadedDocs.find((d) => d.id === activeDocId) || loadedDocs[0] || null;
    setCurrentDocument(doc);
    if (doc) {
      setActiveLanguage(doc.language || 'en');
    }
  }, []);

  const updateProfile = (updates: Partial<ReadingProfile>) => {
    setProfileState((prev) => {
      const updated = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      StorageService.saveProfile(updated);
      return updated;
    });
  };

  const resetProfile = () => {
    setProfileState(DEFAULT_READING_PROFILE);
    StorageService.saveProfile(DEFAULT_READING_PROFILE);
  };

  const setCurrentDocumentId = (id: string) => {
    const doc = documents.find((d) => d.id === id) || null;
    if (doc) {
      setCurrentDocument(doc);
      setActiveLanguage(doc.language || 'en');
      StorageService.setCurrentDocId(id);
      stopReadAloud();
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
    StorageService.saveDocument(newDoc);
    const updatedList = StorageService.getDocuments();
    setDocuments(updatedList);
    setCurrentDocument(newDoc);
    StorageService.setCurrentDocId(newDoc.id);
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    StorageService.deleteDocument(id);
    const remaining = StorageService.getDocuments();
    setDocuments(remaining);
    if (currentDocument?.id === id) {
      setCurrentDocument(remaining[0] || null);
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
      StorageService.saveDocument(updatedDoc);
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
      // Restore translation or original text
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
        StorageService.saveDocument(updatedDoc);
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
      StorageService.saveDocument(updatedDoc);
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
  const startReadAloud = () => {
    if (!currentDocument) return;
    const textToRead = viewMode === 'original' ? currentDocument.originalText : currentDocument.processedText;

    setIsPlayingAudio(true);
    setActiveWordIndex(0);

    TTSService.speak(textToRead, activeLanguage, speechRate, {
      onStart: () => {
        setIsPlayingAudio(true);
        setActiveWordIndex(0);
      },
      onWord: (wordIdx) => {
        setActiveWordIndex(wordIdx);
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

  return (
    <ReaderContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
        documents,
        currentDocument,
        setCurrentDocumentId,
        addDocument,
        deleteDocument,
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
        readingRulerY,
        setReadingRulerY,
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
