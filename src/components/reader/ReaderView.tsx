'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReadingContent } from './ReadingContent';
import { OriginalDocumentView } from './OriginalDocumentView';
import { ReadingControls } from './ReadingControls';
import { FocusModeOverlay } from './FocusModeOverlay';
import { AudioDock } from './AudioDock';
import { LanguageSelector } from './LanguageSelector';
import { SimplificationModal } from './SimplificationModal';
import { ReadingSessionSummaryModal } from './ReadingSessionSummaryModal';
import { Button } from '../common/Button';
import { 
  Sliders, 
  Sparkles, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  PanelLeftClose, 
  PanelLeftOpen, 
  BarChart2,
  Mic
} from 'lucide-react';

export const ReaderView: React.FC = () => {
  const { 
    activeDocument, 
    activePageNumber, 
    setActivePageNumber, 
    viewMode, 
    setViewMode, 
    preferences, 
    updatePreferences, 
    ttsState, 
    seekToWord, 
    activeTranslatedText, 
    setIsSimplificationModalOpen, 
    setIsSessionSummaryOpen, 
    setIsDictationModalOpen,
    documents, 
    selectDocument, 
    updateDocumentProgress 
  } = useApp();

  const [isLeftNavOpen, setIsLeftNavOpen] = useState<boolean>(true);
  const [isRightControlsOpen, setIsRightControlsOpen] = useState<boolean>(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsLeftNavOpen(false);
      setIsRightControlsOpen(false);
    }
  }, []);

  const { setIsUploadModalOpen, setCurrentRoute } = useApp();

  React.useEffect(() => {
    if (!activeDocument && documents.length > 0) {
      selectDocument(documents[0].id);
    }
  }, [activeDocument, documents, selectDocument]);

  if (!activeDocument) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-[#FEF9EB] flex items-center justify-center p-6 text-center">
        <div className="p-8 bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl max-w-md space-y-4 shadow-sm">
          <BookOpen className="w-10 h-10 text-[#D97706] mx-auto" />
          <h2 className="text-xl font-bold text-[#1E1B18]">No Document Selected</h2>
          <p className="text-xs text-[#706655]">
            Please choose a lesson from your library or upload a new PDF/image to start reading.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentRoute('library')}
            >
              Go to Library
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload Document
            </Button>
          </div>
        </div>
      </div>
    );
  }


  const currentPage = activeDocument.pages.find(p => p.pageNumber === activePageNumber) || activeDocument.pages[0];
  const totalPages = activeDocument.pages.length;

  const handlePrevPage = () => {
    if (activePageNumber > 1) {
      setActivePageNumber(activePageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (!activeDocument) return;
    if (activePageNumber < totalPages) {
      const nextPage = activePageNumber + 1;
      setActivePageNumber(nextPage);
      const progress = Math.round((nextPage / totalPages) * 100);
      updateDocumentProgress(activeDocument.id, progress);
    }
  };

  return (
    <div className="relative flex-1 h-[calc(100dvh-65px)] bg-[#FEF9EB] text-[#26231E] flex flex-col overflow-hidden">
      {/* Visual reading ruler / mask overlay if active */}
      <FocusModeOverlay />

      {/* Top Reader Utility Bar */}
      <div className="bg-[#FAF3E0] border-b border-[#E7DFCA] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-30 transition-colors">
        <div className="flex items-center flex-wrap gap-4">
          {/* Left: Left nav toggle & document title */}
          <div className="flex items-center gap-2">
            {!preferences.focusMode && (
            <button
              type="button"
              id="reader-toggle-left-nav"
              onClick={() => setIsLeftNavOpen(!isLeftNavOpen)}
              title={isLeftNavOpen ? "Hide document navigator" : "Show document navigator"}
              className="p-1.5 rounded-lg text-[#706655] hover:text-[#1E1B18] hover:bg-[#EFE8D6] transition-colors"
            >
              {isLeftNavOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
          )}

          <div className="overflow-hidden">
            <h2 className="text-xs sm:text-sm font-bold text-[#1E1B18] truncate max-w-[220px] sm:max-w-md">
              {activeDocument.title}
            </h2>
            <span className="text-[10px] text-[#706655] block">
              Page {activePageNumber} of {totalPages} • {activeDocument.category}
            </span>
          </div>
        </div>

        {/* Center: View Mode Toggle (Original vs Reflowed) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Original vs Personalized Toggle */}
          <div className="flex items-center bg-[#FEF9EB] p-1 rounded-xl border border-[#D8CEB9] shadow-2xs">
            <button
              type="button"
              id="reader-view-original-btn"
              onClick={() => setViewMode('original')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'original'
                  ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs'
                  : 'text-[#524B40] hover:text-[#1E1B18]'
              }`}
            >
              Original View
            </button>
            <button
              type="button"
              id="reader-view-personalized-btn"
              onClick={() => setViewMode('personalized')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'personalized'
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'text-[#524B40] hover:text-[#1E1B18]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Personalized View
            </button>
          </div>

          {/* Multilingual Selector */}
          <LanguageSelector />
        </div>
        </div>

        {/* Right: Actions (Focus mode, Simplify, Dictation, Metrics, Controls Drawer) */}
        <div className="flex flex-wrap items-center justify-end gap-2 ml-auto">
          {/* Voice Dictation Button */}
          <Button
            id="reader-dictation-btn"
            variant="outline"
            size="sm"
            icon={<Mic className="w-3.5 h-3.5 text-[#D97706]" />}
            onClick={() => setIsDictationModalOpen(true)}
            title="Speech Dictation & Voice Translation"
          >
            <span className="hidden md:inline">Voice Dictation</span>
          </Button>

          {/* Simplify Button */}
          <Button
            id="reader-simplify-btn"
            variant="outline"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5 text-[#D97706]" />}
            onClick={() => setIsSimplificationModalOpen(true)}
          >
            <span className="hidden md:inline">Simplify Text</span>
          </Button>

          {/* Focus Mode Toggle */}
          <button
            type="button"
            id="reader-focus-mode-btn"
            onClick={() => updatePreferences({ focusMode: !preferences.focusMode })}
            title={preferences.focusMode ? "Exit Focus Mode" : "Enter Distraction-Free Focus Mode"}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              preferences.focusMode 
                ? 'bg-[#26231E] text-[#FEF9EB] border-[#26231E]' 
                : 'bg-[#FEF9EB] text-[#524B40] border-[#E7DFCA] hover:bg-[#EFE8D6]'
            }`}
          >
            {preferences.focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {preferences.focusMode ? 'Exit Focus' : 'Focus Mode'}
            </span>
          </button>

          {/* Reading Session Summary */}
          <button
            type="button"
            id="reader-session-metrics-btn"
            onClick={() => setIsSessionSummaryOpen(true)}
            title="View reading pace and session metrics"
            className="p-2 rounded-xl text-[#706655] hover:text-[#1E1B18] hover:bg-[#EFE8D6] border border-[#E7DFCA] transition-colors"
          >
            <BarChart2 className="w-4 h-4 text-[#047857]" />
          </button>

          {/* Controls Toggle (Right Sidebar) */}
          {!preferences.focusMode && (
            <Button
              id="reader-toggle-controls-btn"
              variant={isRightControlsOpen ? 'primary' : 'outline'}
              size="sm"
              icon={<Sliders className="w-3.5 h-3.5" />}
              onClick={() => setIsRightControlsOpen(!isRightControlsOpen)}
            >
              <span className="hidden lg:inline">Settings</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main 3-Column Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Document Navigator (Collapsible) */}
        {!preferences.focusMode && isLeftNavOpen && (
          <>
            {/* Mobile Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-[#1E1B18]/20 backdrop-blur-sm z-40" 
              onClick={() => setIsLeftNavOpen(false)} 
            />
            <aside className="fixed lg:static top-[65px] lg:top-0 left-0 bottom-0 z-50 w-72 lg:w-64 bg-[#FAF3E0] border-r border-[#E7DFCA] p-4 flex flex-col justify-between shrink-0 overflow-y-auto shadow-2xl lg:shadow-none animate-in slide-in-from-left-8 lg:animate-none">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#706655]">
                  Lesson Navigator
                </span>
                <h3 className="text-xs font-bold text-[#1E1B18] truncate">
                  {activeDocument.title}
                </h3>
              </div>

              {/* Page Selector List */}
              <div className="space-y-1">
                {activeDocument.pages.map((p) => (
                  <button
                    key={p.pageNumber}
                    onClick={() => setActivePageNumber(p.pageNumber)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      activePageNumber === p.pageNumber
                        ? 'bg-[#26231E] text-[#FEF9EB] shadow-2xs'
                        : 'text-[#524B40] hover:bg-[#EFE8D6]'
                    }`}
                  >
                    <span>Page {p.pageNumber}</span>
                    <span className="text-[10px] opacity-70">
                      {p.paragraphs.length} paragraphs
                    </span>
                  </button>
                ))}
              </div>

              {/* Other Documents in Library Quick Switch */}
              <div className="pt-4 border-t border-[#E7DFCA] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#706655]">
                  Switch Document
                </span>
                <div className="space-y-1">
                  {documents.slice(0, 4).map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => selectDocument(doc.id)}
                      className={`w-full text-left p-2 rounded-lg text-xs truncate transition-colors ${
                        doc.id === activeDocument.id
                          ? 'font-bold text-[#D97706] bg-[#FEF9EB] border border-[#E7DFCA]'
                          : 'text-[#524B40] hover:bg-[#EFE8D6]'
                      }`}
                    >
                      {doc.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick calibration helper */}
            <div className="p-3 bg-[#FEF9EB] border border-[#E7DFCA] rounded-xl text-[11px] text-[#706655] space-y-1">
              <p className="font-semibold text-[#1E1B18]">Personal Sweet Spot</p>
              <p>Adjust font, line height, or warm tints anytime on the right panel.</p>
            </div>
            </aside>
          </>
        )}

        {/* CENTER COLUMN: Reading Canvas Area (Dominant) */}
        <main 
          className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-8 flex flex-col items-center justify-start transition-colors"
          style={{
            backgroundColor: viewMode === 'personalized' ? preferences.backgroundColor : '#F1F5F9'
          }}
        >
          <div className="w-full max-w-4xl space-y-8 pb-32">
            {/* View Mode Switch Notification Bar if in Original View */}
            {viewMode === 'original' ? (
              <OriginalDocumentView
                document={activeDocument}
                page={currentPage}
                currentPageNumber={activePageNumber}
                totalPages={totalPages}
              />
            ) : (
              <ReadingContent
                page={currentPage}
                preferences={preferences}
                ttsState={ttsState}
                translatedText={activeTranslatedText}
                onWordClick={(wordIdx) => {
                  seekToWord(wordIdx);
                }}
              />
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-8 border-t border-[#D8CEB9]/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={activePageNumber <= 1}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous Page
                </Button>

                <span className="text-xs font-mono font-semibold text-[#706655]">
                  Page {activePageNumber} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={activePageNumber >= totalPages}
                  icon={<ChevronRight className="w-4 h-4" />}
                >
                  Next Page
                </Button>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT COLUMN: Personalization Controls Panel (Collapsible) */}
        {!preferences.focusMode && isRightControlsOpen && (
          <>
            {/* Mobile Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-[#1E1B18]/20 backdrop-blur-sm z-40" 
              onClick={() => setIsRightControlsOpen(false)} 
            />
            <aside className="fixed lg:static top-[65px] lg:top-0 right-0 bottom-0 z-50 w-80 bg-[#FAF3E0] border-l border-[#E7DFCA] shrink-0 overflow-y-auto shadow-2xl lg:shadow-none animate-in slide-in-from-right-8 lg:animate-none">
              <ReadingControls onClose={() => setIsRightControlsOpen(false)} />
            </aside>
          </>
        )}
      </div>

      {/* Floating Audio Dock */}
      <AudioDock />

      {/* Modals */}
      <SimplificationModal />
      <ReadingSessionSummaryModal />
    </div>
  );
};
