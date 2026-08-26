'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useReader } from '@/context/ReaderContext';
import { formatTextWithSyllables } from '@/lib/formatting/engine';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import { PDFService } from '@/services/pdf.service';

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
    updateProfile,
  } = useReader();

  const [isSimplifyMenuOpen, setIsSimplifyMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync route param id with current document
  useEffect(() => {
    if (params?.id && typeof params.id === 'string') {
      if (!currentDocument || currentDocument.id !== params.id) {
        setCurrentDocumentId(params.id);
      }
    }
  }, [params?.id, currentDocument]);

  const doc = currentDocument || documents[0];
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === activeLanguage);

  if (!doc) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-body-lg">Document not found.</p>
        <button
          onClick={() => router.push('/upload')}
          className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-full font-bold touch-target"
        >
          Go to upload
        </button>
      </div>
    );
  }

  // Reflow and format text on the fly
  const rawText = viewMode === 'original' ? doc.originalText : doc.processedText;
  const formattedText = PDFService.cleanPDFText(rawText);
  const paragraphs = formattedText.split('\n\n').filter((p) => p.trim().length > 0);

  // Split text into words for live audio karaoke highlighting
  let globalWordCounter = 0;

  // Handle Reading Ruler Mouse & Touch Tracking across mobile and desktop
  const updateRulerPosition = (clientY: number) => {
    if (profile.readingRulerEnabled && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relativeY = clientY - rect.top;
      setReadingRulerY(Math.max(20, Math.min(relativeY, rect.height - 20)));
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateRulerPosition(e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      updateRulerPosition(e.touches[0].clientY);
    }
  };

  // Helper to render individual karaoke-enabled words
  const renderWord = (w: string) => {
    const currentWordGlobalIndex = globalWordCounter++;
    const isCurrentKaraokeWord = isPlayingAudio && activeWordIndex === currentWordGlobalIndex;

    const isBold = w.startsWith('**') && w.endsWith('**');
    const cleanWord = w.replace(/\*\*/g, '');

    const displayText =
      profile.syllableHighlighting && viewMode === 'personalized'
        ? formatTextWithSyllables(cleanWord)
        : cleanWord;

    return (
      <span
        key={currentWordGlobalIndex}
        className={`inline-block transition-all duration-100 mr-1 ${
          isBold ? 'font-bold text-primary' : ''
        } ${isCurrentKaraokeWord ? 'karaoke-active-word scale-105' : ''}`}
      >
        {displayText}
      </span>
    );
  };

  return (
    <div className="w-full pb-12 min-h-dvh">
      {/* Top Document Control Bar */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md z-30 border-b-2 border-surface-container-highest px-4 sm:px-6 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Toggle Personalized vs Original */}
        <div className="flex items-center bg-surface-container-low rounded-full p-1 border-2 border-surface-container-highest shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('personalized')}
            className={`px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-label-md font-label-md font-bold transition-all flex items-center gap-1.5 sm:gap-2 h-touch-target ${
              viewMode === 'personalized'
                ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span
              className="material-symbols-outlined text-lg sm:text-xl"
              style={{ fontVariationSettings: viewMode === 'personalized' ? "'FILL' 1" : "'FILL' 0" }}
            >
              tune
            </span>
            Personalized
          </button>
          <button
            type="button"
            onClick={() => setViewMode('original')}
            className={`px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-label-md font-label-md font-bold transition-all h-touch-target ${
              viewMode === 'original'
                ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Original
          </button>
        </div>

        {/* Action Controls: Reading Ruler, Language Bar, Audio TTS, Simplify */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Reading Ruler Toggle */}
          <button
            type="button"
            onClick={() => updateProfile({ readingRulerEnabled: !profile.readingRulerEnabled })}
            className={`px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-label-md font-label-md font-bold border transition-colors flex items-center gap-1.5 h-touch-target ${
              profile.readingRulerEnabled
                ? 'bg-primary-container text-on-primary-container border-primary shadow-sm'
                : 'bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high'
            }`}
            title="Toggle Reading Focus Ruler"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">highlight</span>
            <span>Ruler</span>
          </button>

          {/* Language Selector Bar */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsLanguageMenuOpen(!isLanguageMenuOpen);
                setIsSimplifyMenuOpen(false);
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-label-md font-label-md font-bold border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5 h-touch-target shadow-xs"
              title="Change Language"
            >
              <span className="material-symbols-outlined text-base sm:text-lg text-primary">language</span>
              <span>{currentLangObj?.nativeName || 'Language'}</span>
              <span className="material-symbols-outlined text-sm sm:text-base">arrow_drop_down</span>
            </button>

            {isLanguageMenuOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-56 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                <p className="text-xs font-bold text-on-surface-variant px-3 py-1.5 border-b border-surface-container-highest mb-1">
                  Select Language
                </p>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = activeLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={async () => {
                          setIsLanguageMenuOpen(false);
                          await setLanguage(lang.code);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'hover:bg-surface-container text-on-surface'
                        }`}
                      >
                        <div>
                          <span className="block text-sm leading-tight">{lang.nativeName}</span>
                          <span className="block text-xs font-normal text-on-surface-variant">{lang.name}</span>
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

          {/* Read Aloud (TTS Audio) */}
          <div className="flex items-center bg-surface-container-lowest border-2 border-surface-container-highest rounded-full px-2 py-1 gap-1 sm:gap-2 shadow-sm h-touch-target">
            <button
              type="button"
              onClick={isPlayingAudio ? pauseReadAloud : startReadAloud}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 bg-primary text-on-primary rounded-full text-xs sm:text-label-md font-label-md font-bold hover:bg-on-primary-fixed-variant transition-colors"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">
                {isPlayingAudio ? 'pause' : 'volume_up'}
              </span>
              <span>{isPlayingAudio ? 'Pause' : 'Listen'}</span>
            </button>
            {isPlayingAudio && (
              <button
                type="button"
                onClick={stopReadAloud}
                className="p-1 text-on-surface-variant hover:text-error rounded-full"
                title="Stop reading"
              >
                <span className="material-symbols-outlined text-base sm:text-lg">stop</span>
              </button>
            )}
            <select
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              aria-label="Speech rate"
              className="bg-transparent text-xs font-bold text-on-surface border-0 focus:ring-0 cursor-pointer py-1 pr-4"
            >
              <option value="0.75">0.75x</option>
              <option value="0.95">1.0x</option>
              <option value="1.2">1.2x</option>
            </select>
          </div>

          {/* Simplify text Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSimplifyMenuOpen(!isSimplifyMenuOpen);
                setIsLanguageMenuOpen(false);
              }}
              className="flex items-center gap-1.5 bg-primary text-on-primary px-3.5 sm:px-6 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-label-md font-label-md font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors active:scale-95 shadow-sm h-touch-target"
            >
              <span
                className="material-symbols-outlined text-base sm:text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span>Simplify {simplifyLevel !== 'off' ? `(${simplifyLevel})` : ''}</span>
            </button>

            {isSimplifyMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95">
                <p className="text-xs font-bold text-on-surface-variant px-3 py-1">AI Simplification</p>
                {(['off', 'light', 'medium', 'heavy'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setSimplifyLevel(lvl);
                      setIsSimplifyMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-between capitalize transition-colors ${
                      simplifyLevel === lvl
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <span>{lvl}</span>
                    {simplifyLevel === lvl && (
                      <span className="material-symbols-outlined text-sm">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Reading Canvas */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchMove}
          className="relative w-full p-6 sm:p-8 md:p-10 select-text rounded-2xl shadow-sm border border-surface-container-highest transition-colors duration-200"
          style={{
            backgroundColor: viewMode === 'personalized' ? profile.backgroundColor : '#ffffff',
            color: viewMode === 'personalized' ? profile.textColor : '#111111',
            fontFamily: viewMode === 'personalized' ? profile.fontFamily : 'Open Sans, sans-serif',
            fontSize: viewMode === 'personalized' ? `${profile.fontSize}px` : '18px',
            fontWeight: viewMode === 'personalized' ? profile.fontWeight : 400,
            lineHeight: viewMode === 'personalized' ? profile.lineHeight : 1.5,
            letterSpacing: viewMode === 'personalized' ? `${profile.letterSpacing}em` : 'normal',
            wordSpacing: viewMode === 'personalized' ? `${profile.wordSpacing}em` : 'normal',
            textAlign: viewMode === 'personalized' ? profile.textAlign : 'left',
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
          <header className="mb-6 sm:mb-8 border-b pb-4 border-surface-container-highest">
            <h1
              className="text-headline-md sm:text-headline-lg font-headline-md sm:font-headline-lg font-bold text-primary mb-2"
              style={{
                fontFamily: viewMode === 'personalized' ? profile.fontFamily : 'inherit',
              }}
            >
              {doc.title}
            </h1>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-on-surface-variant flex-wrap">
              <span className="font-semibold">{doc.wordCount || 0} words</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-xs font-bold">
                {currentLangObj?.nativeName || doc.language.toUpperCase()}
              </span>
              <span>•</span>
              <span>{doc.sourceFormat.toUpperCase()}</span>
            </div>
          </header>

          {/* Formatted Semantic Paragraphs, Headings, and Lists with Karaoke */}
          <div
            className="reading-content w-full"
            style={{
              maxWidth: viewMode === 'personalized' ? `${profile.maxCharactersPerLine}ch` : '70ch',
            }}
          >
            {paragraphs.map((pText, pIdx) => {
              const isHeading = pText.startsWith('###') || pText.startsWith('##') || pText.startsWith('#');
              const isBullet = pText.startsWith('•') || pText.startsWith('-');

              if (isHeading) {
                const headingText = pText.replace(/^#+\s*/, '');
                const headingWords = headingText.trim().split(/\s+/);

                return (
                  <h2
                    key={pIdx}
                    className="text-xl sm:text-2xl font-bold text-primary mt-8 mb-4 pt-3 border-b border-surface-container-highest flex items-center gap-2"
                    style={{
                      fontFamily: viewMode === 'personalized' ? profile.fontFamily : 'inherit',
                    }}
                  >
                    <span className="material-symbols-outlined text-primary text-xl">bookmark</span>
                    {headingWords.map((w) => renderWord(w))}
                  </h2>
                );
              }

              if (isBullet) {
                const bulletItems = pText.split('\n').filter(Boolean);
                return (
                  <div key={pIdx} className="space-y-2 my-4 pl-2">
                    {bulletItems.map((bItem, bIdx) => {
                      const cleanItem = bItem.replace(/^[•\-\*]\s*/, '');
                      const itemWords = cleanItem.split(/\s+/);
                      return (
                        <div key={bIdx} className="flex items-start gap-2.5">
                          <span className="text-primary font-bold text-base select-none mt-0.5">•</span>
                          <p
                            className="flex-1"
                            style={{
                              lineHeight: viewMode === 'personalized' ? profile.lineHeight : 1.6,
                            }}
                          >
                            {itemWords.map((w) => renderWord(w))}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              const wordsInParagraph = pText.trim().split(/\s+/);
              return (
                <p
                  key={pIdx}
                  style={{
                    marginBottom: viewMode === 'personalized' ? `${profile.paragraphSpacing}px` : '24px',
                  }}
                >
                  {wordsInParagraph.map((w) => renderWord(w))}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
