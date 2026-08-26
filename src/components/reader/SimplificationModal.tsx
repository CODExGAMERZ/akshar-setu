'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { simplificationService, SimplifiedResult } from '../../services/simplificationService';
import { Sparkles, Loader2, BookOpen, CheckCircle2, ListOrdered } from 'lucide-react';

export const SimplificationModal: React.FC = () => {
  const { 
    isSimplificationModalOpen, 
    setIsSimplificationModalOpen, 
    activeDocument, 
    activePageNumber,
    startTTS 
  } = useApp();

  const [simplifiedData, setSimplifiedData] = useState<SimplifiedResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentPage = activeDocument?.pages.find(p => p.pageNumber === activePageNumber) || activeDocument?.pages[0];

  useEffect(() => {
    async function loadSimplified() {
      if (isSimplificationModalOpen && currentPage) {
        setIsLoading(true);
        try {
          const res = await simplificationService.simplify(currentPage.content);
          setSimplifiedData(res);
        } catch (e) {
          console.warn('Failed to simplify text:', e);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadSimplified();
  }, [isSimplificationModalOpen, currentPage]);

  const handleReadAloudSimplified = () => {
    if (simplifiedData) {
      setIsSimplificationModalOpen(false);
      startTTS(simplifiedData.simplifiedText);
    }
  };

  return (
    <Modal
      isOpen={isSimplificationModalOpen}
      onClose={() => setIsSimplificationModalOpen(false)}
      title="AI Educational Text Simplification"
      subtitle="Reflows complex paragraphs into bite-sized, accessible sentences"
      maxWidth="2xl"
    >
      <div className="space-y-6 text-[#26231E]">
        {isLoading && (
          <div className="py-12 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF1DA] text-[#D97706] flex items-center justify-center mx-auto border border-[#E4D5AD]">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#1E1B18]">Simplifying Lesson Text...</h4>
              <p className="text-xs text-[#706655]">
                Restructuring passive voice, complex subordinate clauses, and vocabulary.
              </p>
            </div>
          </div>
        )}

        {!isLoading && simplifiedData && (
          <div className="space-y-5">
            {/* Top Reduction Badge */}
            <div className="p-3.5 bg-[#FAF1DA] border border-[#E4D5AD] rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span className="font-bold text-[#1E1B18]">Reading Complexity Adjusted:</span>
                <span className="text-[#8C6D23] font-semibold">{simplifiedData.readingGradeReduction}</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#FEF9EB] text-[#26231E] font-medium border border-[#E4D5AD]">
                WCAG Plain Language
              </span>
            </div>

            {/* Key Bullet Summary */}
            <div className="p-4 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-[#D97706]" />
                Core Ideas in 3 Points:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#524B40] list-disc list-inside leading-relaxed">
                {simplifiedData.bulletSummary.map((item, idx) => (
                  <li key={idx}><strong>{item}</strong></li>
                ))}
              </ul>
            </div>

            {/* Simplified Readable Body */}
            <div className="p-5 bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                Simplified Full Lesson Content:
              </h4>
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
                icon={<Sparkles className="w-4 h-4" />}
                onClick={handleReadAloudSimplified}
              >
                Read Aloud Simplified Text
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
