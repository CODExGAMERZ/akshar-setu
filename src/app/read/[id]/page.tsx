'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useReader } from '@/context/ReaderContext';
import { formatTextWithSyllables, renderConfusableSpans } from '@/lib/formatting/engine';
import { AVAILABLE_FONTS, SUPPORTED_LANGUAGES, THEME_PRESETS } from '@/lib/constants';
import { PDFService } from '@/services/pdf.service';
import { DocumentService } from '@/services/document.service';
import { FontFamily, ThemePreset } from '@/types';

export default function ReadingViewPage() {
  const params = useParams();
  const router = useRouter();
  const {
    profile,
    documents,
    currentDocument,
    setCurrentDocumentId,
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
    updateProfile,
    focusMode,
    setFocusMode,
    confusableLettersEnabled,
    setConfusableLettersEnabled,
    confusablePairs,
    toggleConfusablePair,
    highlightMode,
    setHighlightMode,
    saveAsGlobalSettings,
    saveForCurrentDocumentOnly,
  } = useReader();

  const [isSimplifyMenuOpen, setIsSimplifyMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Multi-tier document lookup guaranteeing zero "document not found" after upload or refresh
  const doc = useMemo(() => {
    const routeId = params?.id as string;
    if (routeId) {
      if (currentDocument && currentDocument.id === routeId) return currentDocument;
      const foundInState = documents.find((d) => d.id === routeId);
      if (foundInState) return foundInState;
      const freshDoc = DocumentService.getDocumentById(routeId);
      if (freshDoc) return freshDoc;
    }
    return currentDocument || documents[0] || null;
  }, [params?.id, currentDocument, documents]);

  // Sync route param id with current document state
  useEffect(() => {
    if (doc && (!currentDocument || currentDocument.id !== doc.id)) {
      setCurrentDocumentId(doc.id);
    }
  }, [doc, currentDocument, setCurrentDocumentId]);

  // Auto-follow audio voice: smoothly glide Reading Focus Ruler and auto-scroll viewport
  useEffect(() => {
    if (!isPlayingAudio || activeWordIndex < 0) return;

    const rafId = requestAnimationFrame(() => {
      const activeEl = document.querySelector('.karaoke-active-word') as HTMLElement;
      if (!activeEl || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const wordRect = activeEl.getBoundingClientRect();
      const rulerHeight = profile.readingRulerHeight || 44;
      const relativeY = wordRect.top - containerRect.top + wordRect.height / 2 - rulerHeight / 2;

      if (profile.readingRulerEnabled) {
        setReadingRulerY(Math.max(10, Math.min(relativeY, containerRect.height - rulerHeight - 10)));
      }

      const viewportHeight = window.innerHeight;
      const wordTop = wordRect.top;
      if (wordTop < 120 || wordTop > viewportHeight - 160) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [activeWordIndex, isPlayingAudio, profile.readingRulerEnabled, profile.readingRulerHeight, setReadingRulerY]);

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === (doc?.language || activeLanguage));

  // Reflow and format text
  const rawText = viewMode === 'original' ? (doc?.originalText || '') : (doc?.processedText || '');
  const formattedText = PDFService.cleanPDFText(rawText);
  const paragraphs = formattedText.split('\n\n').filter((p) => p.trim().length > 0);

  // Extract sentences and word offsets for previous/next sentence jumping
  const sentences = useMemo(() => {
    return formattedText.split(/(?<=[.!?\n])\s+/).map((s) => s.trim()).filter((s) => s.length > 0);
  }, [formattedText]);

  const totalSentences = Math.max(1, sentences.length);

  const sentenceWordOffsets = useMemo(() => {
    const offsets: number[] = [];
    let currentOffset = 0;
    sentences.forEach((sentence) => {
      offsets.push(currentOffset);
      const wordsInSentence = sentence.split(/\s+/).filter(Boolean).length;
      currentOffset += wordsInSentence;
    });
    return offsets;
  }, [sentences]);

  const currentSentenceIndex = useMemo(() => {
    if (activeWordIndex < 0) return 0;
    let idx = 0;
    for (let i = 0; i < sentenceWordOffsets.length; i++) {
      if (activeWordIndex >= sentenceWordOffsets[i]) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [activeWordIndex, sentenceWordOffsets]);

  const handlePreviousSentence = () => {
    const targetIdx = Math.max(0, currentSentenceIndex - 1);
    const targetWordOffset = sentenceWordOffsets[targetIdx] || 0;
    startReadAloud(targetWordOffset);
  };

  const handleNextSentence = () => {
    const targetIdx = Math.min(sentences.length - 1, currentSentenceIndex + 1);
    const targetWordOffset = sentenceWordOffsets[targetIdx] || 0;
    startReadAloud(targetWordOffset);
  };

  if (!doc) {
    return (
      <div className="w-full p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
          <span className="material-symbols-outlined text-3xl">menu_book</span>
        </div>
        <p className="text-lg font-bold text-on-surface mb-1">Loading Document...</p>
        <p className="text-xs text-on-surface-variant mb-4">Please wait while your document is formatted.</p>
        <button
          onClick={() => router.push('/library')}
          className="mt-2 px-6 py-2 bg-primary text-on-primary rounded-full font-bold text-xs touch-target"
        >
          Go to Library
        </button>
      </div>
    );
  }

  let globalWordCounter = 0;

  const updateRulerPosition = (clientY: number) => {
    if (profile.readingRulerEnabled && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relativeY = clientY - rect.top;
      setReadingRulerY(Math.max(20, Math.min(relativeY, rect.height - 20)));
    }
  };

  const handleSaveGlobal = () => {
    saveAsGlobalSettings();
    setSaveBanner('Saved as global reading preferences.');
    setTimeout(() => setSaveBanner(null), 3000);
  };

  const handleSaveDocOnly = () => {
    saveForCurrentDocumentOnly();
    setSaveBanner(`Saved preferences for "${doc.title}" only.`);
    setTimeout(() => setSaveBanner(null), 3000);
  };

  // Helper to render formatted line/paragraph with live karaoke words & confusable letter cues
  const renderFormattedTokens = (rawContent: string) => {
    const rawTokens = rawContent.trim().split(/\s+/);
    let isInsideBold = false;

    return rawTokens.map((rawToken, tIdx) => {
      let token = rawToken;
      let boldThisWord = isInsideBold;

      if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
        boldThisWord = true;
        token = token.slice(2, -2);
      } else if (token.startsWith('**')) {
        isInsideBold = true;
        boldThisWord = true;
        token = token.slice(2);
      } else if (token.includes('**')) {
        boldThisWord = true;
        token = token.replace(/\*\*/g, '');
        isInsideBold = false;
      }

      const currentWordGlobalIndex = globalWordCounter++;
      const isCurrentKaraokeWord = isPlayingAudio && activeWordIndex === currentWordGlobalIndex;

      let displayText: React.ReactNode = token;
      if (profile.syllableHighlighting && viewMode === 'personalized') {
        displayText = formatTextWithSyllables(token);
      }

      if (confusableLettersEnabled && viewMode === 'personalized') {
        displayText = renderConfusableSpans(
          typeof displayText === 'string' ? displayText : token,
          true,
          confusablePairs
        );
      }

      return (
        <span
          key={`${tIdx}-${currentWordGlobalIndex}`}
          className={`inline transition-colors duration-100 rounded-xs px-0.5 mr-0.5 ${
            boldThisWord ? 'font-bold text-primary' : ''
          } ${isCurrentKaraokeWord ? 'karaoke-active-word' : ''}`}
        >
          {displayText}
        </span>
      );
    });
  };

  // Heading scale: 1.5x body text font size
  const headingFontSize = Math.round(profile.fontSize * 1.5);
  const titleFontSize = Math.round(profile.fontSize * 1.75);

  return (
    <div className={`w-full pb-36 min-h-dvh overflow-x-hidden ${focusMode ? 'focus-mode-active' : ''}`}>
      {/* Top Document Control Bar */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md z-30 border-b-2 border-surface-container-highest px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-2.5 shadow-xs max-w-full">
        {/* Toggle Personalized vs Original */}
        <div className="flex items-center bg-surface-container-low rounded-full p-1 border-2 border-surface-container-highest shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('personalized')}
            className={`px-3 sm:px-5 py-1.5 rounded-full text-xs sm:text-label-md font-bold transition-all flex items-center gap-1.5 touch-target ${
              viewMode === 'personalized'
                ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span
              className="material-symbols-outlined text-base sm:text-lg"
              style={{ fontVariationSettings: viewMode === 'personalized' ? "'FILL' 1" : "'FILL' 0" }}
            >
              tune
            </span>
            Personalized
          </button>
          <button
            type="button"
            onClick={() => setViewMode('original')}
            className={`px-3 sm:px-5 py-1.5 rounded-full text-xs sm:text-label-md font-bold transition-all touch-target ${
              viewMode === 'original'
                ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Original
          </button>
        </div>

        {/* Action Controls: Focus Mode, Confusable Letters, Ruler, Language, Quick Adjust */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
          {/* Focus Mode Toggle */}
          <button
            type="button"
            onClick={() => setFocusMode(!focusMode)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1 touch-target ${
              focusMode
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high'
            }`}
            title="Toggle Distraction-Free Focus Mode"
          >
            <span className="material-symbols-outlined text-base">center_focus_strong</span>
            <span className="hidden sm:inline">{focusMode ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>

          {/* Confusable Letters Toggle */}
          <button
            type="button"
            onClick={() => setConfusableLettersEnabled(!confusableLettersEnabled)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1 touch-target ${
              confusableLettersEnabled
                ? 'bg-secondary-container text-on-secondary-container border-primary shadow-sm'
                : 'bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high'
            }`}
            title="Toggle b/d, p/q, m/w highlighting"
          >
            <span className="material-symbols-outlined text-base">rule</span>
            <span className="hidden md:inline">b/d Cues</span>
          </button>

          {/* Reading Ruler Toggle */}
          <button
            type="button"
            onClick={() => updateProfile({ readingRulerEnabled: !profile.readingRulerEnabled })}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1 touch-target ${
              profile.readingRulerEnabled
                ? 'bg-secondary-container text-on-secondary-container border-primary shadow-sm'
                : 'bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high'
            }`}
            title="Toggle Reading Focus Ruler"
          >
            <span className="material-symbols-outlined text-base">highlight</span>
            <span className="hidden xs:inline">Ruler</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsLanguageMenuOpen(!isLanguageMenuOpen);
                setIsSimplifyMenuOpen(false);
                setIsQuickSettingsOpen(false);
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1 touch-target shadow-xs"
              title="Change Language"
            >
              <span className="material-symbols-outlined text-base text-primary">language</span>
              <span>{currentLangObj?.nativeName || 'Language'}</span>
              <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
            </button>

            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl shadow-xl p-2 z-50 animate-in fade-in">
                <p className="text-xs font-bold text-on-surface-variant px-3 py-1.5 border-b border-surface-container-highest mb-1">
                  Select Language (11 Languages)
                </p>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = (doc?.language || activeLanguage) === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={async () => {
                          setIsLanguageMenuOpen(false);
                          await setLanguage(lang.code);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'hover:bg-surface-container text-on-surface'
                        }`}
                      >
                        <div>
                          <span className="block">{lang.nativeName}</span>
                          <span className="block text-[11px] font-normal text-on-surface-variant">{lang.name}</span>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-sm text-primary">check</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Adjust Sheet Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsQuickSettingsOpen(!isQuickSettingsOpen);
                setIsLanguageMenuOpen(false);
                setIsSimplifyMenuOpen(false);
              }}
              className="p-2 rounded-full border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high touch-target"
              title="Quick Typography Adjust"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
            </button>

            {isQuickSettingsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-surface-container-lowest border-2 border-surface-container-highest rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in space-y-4">
                <div className="flex items-center justify-between border-b pb-2 border-surface-container-highest">
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">format_size</span>
                    Quick Typography Controls
                  </span>
                  <Link href="/profile" className="text-[11px] text-primary underline font-bold">
                    All Settings →
                  </Link>
                </div>

                {/* Font Family Quick Select */}
                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">Font Family</label>
                  <select
                    value={profile.fontFamily}
                    onChange={(e) => updateProfile({ fontFamily: e.target.value as FontFamily })}
                    className="w-full p-2 bg-surface-bright border border-surface-container-highest rounded-lg text-xs font-bold text-on-surface"
                  >
                    {AVAILABLE_FONTS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size Quick Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-on-surface mb-1">
                    <span>Font Size</span>
                    <span className="text-primary">{profile.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="32"
                    value={profile.fontSize}
                    onChange={(e) => updateProfile({ fontSize: parseInt(e.target.value, 10) })}
                  />
                </div>

                {/* Per-Document Overrides Save Buttons */}
                <div className="pt-2 border-t border-surface-container-highest flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDocOnly}
                    className="w-full py-2 px-3 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-bold hover:bg-primary/20 transition-colors"
                  >
                    Save for This Document Only
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveGlobal}
                    className="w-full py-2 px-3 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-on-primary-fixed-variant transition-colors"
                  >
                    Save as Global Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveBanner && (
        <div className="w-full bg-secondary-container border-b border-primary/20 px-4 py-2 text-center text-xs font-bold text-on-secondary-container flex items-center justify-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Main Reading Canvas Container */}
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 md:px-8 py-6 sm:py-8 overflow-hidden">
        <div
          ref={containerRef}
          onMouseMove={(e) => updateRulerPosition(e.clientY)}
          onTouchMove={(e) => e.touches[0] && updateRulerPosition(e.touches[0].clientY)}
          onTouchStart={(e) => e.touches[0] && updateRulerPosition(e.touches[0].clientY)}
          className={`relative w-full max-w-full p-5 sm:p-8 md:p-10 select-text rounded-3xl shadow-sm border border-surface-container-highest transition-all duration-200 overflow-hidden box-border ${
            isTranslating || isSimplifying ? 'opacity-60 pointer-events-none' : ''
          }`}
          style={{
            backgroundColor: viewMode === 'personalized' ? profile.backgroundColor : '#ffffff',
            color: viewMode === 'personalized' ? profile.textColor : '#111111',
            fontFamily: viewMode === 'personalized' ? profile.fontFamily : 'Open Sans, sans-serif',
            fontSize: viewMode === 'personalized' ? `${profile.fontSize}px` : '18px',
            fontWeight: viewMode === 'personalized' ? profile.fontWeight : 400,
            lineHeight: viewMode === 'personalized' ? profile.lineHeight : 1.5,
            letterSpacing: viewMode === 'personalized' ? `${profile.letterSpacing}em` : 'normal',
            wordSpacing: viewMode === 'personalized' ? `${profile.wordSpacing}em` : 'normal',
            textAlign: 'left', // Strictly left-aligned
            minHeight: '75dvh',
          }}
        >
          {/* Digital Reading Ruler Overlay */}
          {profile.readingRulerEnabled && (
            <div
              className="pointer-events-none absolute left-0 w-full transition-all duration-75 ease-out rounded"
              style={{
                top: `${readingRulerY}px`,
                height: `${profile.readingRulerHeight || 44}px`,
                backgroundColor: 'rgba(253, 190, 84, 0.28)',
                borderTop: '2px solid rgba(127, 87, 0, 0.4)',
                borderBottom: '2px solid rgba(127, 87, 0, 0.4)',
                boxShadow: '0 0 12px rgba(253, 190, 84, 0.3)',
              }}
            />
          )}

          {/* Document Header */}
          <header className="mb-6 sm:mb-8 border-b pb-4 border-surface-container-highest max-w-full overflow-hidden">
            <h1
              className="font-bold text-primary mb-2 break-words"
              style={{
                fontSize: viewMode === 'personalized' ? `${titleFontSize}px` : '26px',
                fontFamily: viewMode === 'personalized' ? profile.fontFamily : 'inherit',
              }}
            >
              {doc.title}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-on-surface-variant flex-wrap">
              <span className="font-semibold">{doc.wordCount || 0} words</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-xs font-bold">
                {currentLangObj?.nativeName || doc.language?.toUpperCase() || 'EN'}
              </span>
              <span>•</span>
              <span>{doc.sourceFormat?.toUpperCase() || 'TEXT'}</span>
            </div>
          </header>

          {/* Formatted Semantic Paragraphs, 1.5x Headings, and Lists with Karaoke */}
          <div
            className="reading-content w-full max-w-full overflow-hidden"
            style={{
              maxWidth: viewMode === 'personalized' ? `min(100%, ${profile.maxCharactersPerLine}ch)` : 'min(100%, 70ch)',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {paragraphs.map((pText, pIdx) => {
              const isHeading = pText.startsWith('###') || pText.startsWith('##') || pText.startsWith('#');
              const isBullet = pText.startsWith('•') || pText.startsWith('-');

              if (isHeading) {
                const headingText = pText.replace(/^#+\s*/, '');

                return (
                  <h2
                    key={pIdx}
                    className="font-bold text-primary mt-6 mb-3 pt-2 border-b border-surface-container-highest flex items-center gap-1.5 flex-wrap max-w-full"
                    style={{
                      fontSize: viewMode === 'personalized' ? `${headingFontSize}px` : '20px',
                      fontFamily: viewMode === 'personalized' ? profile.fontFamily : 'inherit',
                    }}
                  >
                    <span className="material-symbols-outlined text-primary text-lg shrink-0">bookmark</span>
                    {renderFormattedTokens(headingText)}
                  </h2>
                );
              }

              if (isBullet) {
                const bulletItems = pText.split('\n').filter(Boolean);
                return (
                  <div key={pIdx} className="space-y-1.5 my-3 pl-1 sm:pl-2 max-w-full overflow-hidden">
                    {bulletItems.map((bItem, bIdx) => {
                      const cleanItem = bItem.replace(/^[•\-\*]\s*/, '');
                      return (
                        <div key={bIdx} className="flex items-start gap-2 max-w-full">
                          <span className="text-primary font-bold text-base select-none mt-0.5 shrink-0">•</span>
                          <p
                            className="flex-1 max-w-full break-words"
                            style={{
                              lineHeight: viewMode === 'personalized' ? profile.lineHeight : 1.6,
                            }}
                          >
                            {renderFormattedTokens(cleanItem)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              return (
                <p
                  key={pIdx}
                  className="max-w-full break-words"
                  style={{
                    marginBottom: viewMode === 'personalized' ? `${profile.paragraphSpacing}px` : '20px',
                  }}
                >
                  {renderFormattedTokens(pText)}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Audio Dock (Section 22 of Specification) */}
      <aside
        aria-label="Audio Reader Controls"
        className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-surface-bright/95 backdrop-blur-xl border-2 border-primary/20 shadow-2xl rounded-full p-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 transition-all animate-in fade-in slide-in-from-bottom-4"
      >
        {/* Left: Play / Pause Button + Replay */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={isPlayingAudio ? pauseReadAloud : () => startReadAloud(sentenceWordOffsets[currentSentenceIndex] || 0)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 touch-target ${
              isPlayingAudio
                ? 'bg-primary text-on-primary ring-2 ring-primary/40'
                : 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant'
            }`}
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">
              {isPlayingAudio ? 'pause' : 'volume_up'}
            </span>
            <span>{isPlayingAudio ? 'Pause' : 'Read Aloud'}</span>
          </button>

          <button
            type="button"
            onClick={replayReadAloud}
            className="p-2 sm:p-2.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors touch-target"
            title="Replay from start"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">replay</span>
          </button>
        </div>

        {/* Center: Sentence Navigation & Live Progress Status */}
        <div className="flex items-center gap-1 sm:gap-2 justify-center flex-1 min-w-0">
          {/* Previous Sentence Button */}
          <button
            type="button"
            onClick={handlePreviousSentence}
            disabled={currentSentenceIndex <= 0}
            className="p-1.5 sm:p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none transition-colors touch-target"
            title="Previous sentence"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">skip_previous</span>
          </button>

          {/* Sentence Progress Text Badge */}
          <div className="text-center px-1.5 sm:px-3 py-1 rounded-xl bg-surface-container-low border border-surface-container-highest min-w-[100px] sm:min-w-[130px]">
            <div className="flex items-center justify-center gap-1.5">
              {isPlayingAudio && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
              <p className="text-[11px] sm:text-xs font-bold text-on-surface truncate">
                Sentence {currentSentenceIndex + 1} of {totalSentences}
              </p>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1 mt-1 overflow-hidden">
              <div
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${Math.round(((currentSentenceIndex + 1) / totalSentences) * 100)}%` }}
              />
            </div>
          </div>

          {/* Next Sentence Button */}
          <button
            type="button"
            onClick={handleNextSentence}
            disabled={currentSentenceIndex >= totalSentences - 1}
            className="p-1.5 sm:p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none transition-colors touch-target"
            title="Next sentence"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">skip_next</span>
          </button>
        </div>

        {/* Right: Speed Selector Pill & Stop */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container text-on-surface text-xs font-bold border border-surface-container-highest hover:bg-surface-container-high transition-colors shadow-xs touch-target"
              title="Change speech rate"
            >
              <span className="material-symbols-outlined text-sm text-primary">speed</span>
              <span>{speechRate}×</span>
            </button>

            {isSpeedMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-28 bg-surface-container-lowest border-2 border-surface-container-highest rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in space-y-1">
                {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      setSpeechRate(rate);
                      setIsSpeedMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between ${
                      speechRate === rate
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <span>{rate}×</span>
                    {speechRate === rate && (
                      <span className="material-symbols-outlined text-xs text-primary">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isPlayingAudio && (
            <button
              type="button"
              onClick={stopReadAloud}
              className="p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors touch-target"
              title="Stop audio"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">stop</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
