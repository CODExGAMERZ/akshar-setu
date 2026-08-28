'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { simplificationService, SimplifiedResult } from '../../services/simplificationService';
import { Sparkles, Loader2, BookOpen, CheckCircle2, ListOrdered, Volume2, Copy, Check } from 'lucide-react';

export const SimplificationModal: React.FC = () => {
  const { 
    isSimplificationModalOpen, 
    setIsSimplificationModalOpen, 
    activeDocument, 
    activePageNumber,
    startTTS,
    showNotification
  } = useApp();

  const [simplifiedData, setSimplifiedData] = useState<SimplifiedResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [copied, setCopied] = useState(false);

  const currentPage = activeDocument?.pages.find(p => p.pageNumber === activePageNumber) || activeDocument?.pages[0];

  useEffect(() => {
    async function loadSimplified() {
      if (isSimplificationModalOpen && currentPage) {
        setIsLoading(true);
        try {
          const res = await simplificationService.simplify(currentPage.content, selectedLevel);
          setSimplifiedData(res);
          showNotification('Text simplified with WCAG Plain Language guidelines!', 'success', 'Simplification Complete');
        } catch (e) {
          console.warn('Failed to simplify text:', e);
          showNotification('Failed to simplify text. Please try again.', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadSimplified();
  }, [isSimplificationModalOpen, currentPage, selectedLevel]);

  const handleReadAloudSimplified = () => {
    if (simplifiedData) {
      setIsSimplificationModalOpen(false);
      startTTS(simplifiedData.simplifiedText);
      showNotification('Playing simplified speech audio...', 'info');
    }
  };

  const handleCopy = () => {
    if (simplifiedData) {
      navigator.clipboard.writeText(simplifiedData.simplifiedText);
      setCopied(true);
      showNotification('Simplified text copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isSimplificationModalOpen}
      onClose={() => setIsSimplificationModalOpen(false)}
      title="Cognitive Text Simplification"
      subtitle="Reflows complex paragraphs into bite-sized, accessible sentences"
      maxWidth="2xl"
    >
      <div className="space-y-5 text-[#26231E]">
        {/* Simplification Intensity Level Selector */}
        <div className="p-3.5 bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span className="text-xs font-bold text-[#1E1B18]">Simplification Level:</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FEF9EB] p-1 rounded-xl border border-[#D8CEB9]">
            {(['light', 'medium', 'heavy'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all ${
                  selectedLevel === lvl
                    ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs'
                    : 'text-[#706655] hover:text-[#1E1B18] hover:bg-[#EFE8D6]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="py-12 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF1DA] text-[#D97706] flex items-center justify-center mx-auto border border-[#E4D5AD] shadow-inner">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#1E1B18]">Restructuring Lesson Text...</h4>
              <p className="text-xs text-[#706655]">
                Adjusting multi-syllabic vocabulary, subordinate clauses, and passive voice.
              </p>
            </div>
          </div>
        )}

        {!isLoading && simplifiedData && (
          <div className="space-y-4">
            {/* Top Reduction Badge */}
            <div className="p-3.5 bg-[#FAF1DA] border border-[#E4D5AD] rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                <span className="font-bold text-[#1E1B18]">Reading Complexity Adjusted:</span>
                <span className="text-[#8C6D23] font-semibold">{simplifiedData.readingGradeReduction}</span>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FEF9EB] text-[#26231E] font-bold border border-[#E4D5AD]">
                WCAG Plain Language
              </span>
            </div>

            {/* Key Bullet Summary */}
            <div className="p-4 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl space-y-2 shadow-2xs">
              <h4 className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-[#D97706]" />
                Core Ideas in 3 Points:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#524B40] list-disc list-inside leading-relaxed font-medium">
                {simplifiedData.bulletSummary.map((item, idx) => (
                  <li key={idx}><strong>{item}</strong></li>
                ))}
              </ul>
            </div>

            {/* Simplified Readable Body */}
            <div className="p-5 bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-[#E7DFCA] pb-2">
                <h4 className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                  Simplified Lesson Content:
                </h4>
                <button
                  onClick={handleCopy}
                  className="text-xs text-[#706655] hover:text-[#1E1B18] flex items-center gap-1 font-semibold p-1 rounded-lg hover:bg-[#EFE8D6]"
                  title="Copy text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-sm sm:text-base text-[#1E1B18] leading-[1.85] font-sans space-y-3">
                {simplifiedData.simplifiedText.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsSimplificationModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="accent"
                icon={<Volume2 className="w-4 h-4" />}
                onClick={handleReadAloudSimplified}
              >
                Listen to Simplified Text
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
