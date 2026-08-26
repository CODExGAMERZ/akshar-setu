'use client';

import React from 'react';
import { Document, DocumentPage } from '../../types';
import { FileText, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export interface OriginalDocumentViewProps {
  document: Document;
  page: DocumentPage;
  currentPageNumber: number;
  totalPages: number;
}

export const OriginalDocumentView: React.FC<OriginalDocumentViewProps> = ({
  document,
  page,
  currentPageNumber,
  totalPages
}) => {
  const { setViewMode } = useApp();
  const style = document.originalViewStyle;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-md p-8 sm:p-12 text-slate-800 font-serif leading-relaxed space-y-6 animate-in fade-in">
      {/* Banner / Notice */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 not-prose font-sans">
        <div className="flex items-center gap-2 text-xs text-amber-900">
          <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Viewing unformatted textbook page. Switch to personalized view for dyslexia-friendly adjustments.</span>
        </div>
        <Button
          variant="accent"
          size="sm"
          icon={<Sparkles className="w-3.5 h-3.5" />}
          onClick={() => setViewMode('personalized')}
        >
          Reflow View
        </Button>
      </div>

      {/* Textbook Header Layout Mock */}
      <div className="border-b-2 border-slate-800 pb-4 space-y-1">
        <div className="flex items-center justify-between text-xs uppercase font-sans tracking-widest font-bold text-slate-500">
          <span>{style?.chapterNumber || `PAGE 0${currentPageNumber}`}</span>
          <span>{document.category}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
          {document.title}
        </h1>
        {style?.subheading && (
          <p className="text-xs sm:text-sm italic text-slate-600 font-sans">
            {style.subheading}
          </p>
        )}
      </div>

      {/* Body in traditional 2-column textbook serif layout */}
      <div className="space-y-4 text-base text-slate-800 leading-normal text-justify">
        {page.paragraphs.map((p, idx) => (
          <p key={idx} className="indent-6">
            {p}
          </p>
        ))}
      </div>

      {/* Footer page stamp */}
      <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs font-sans text-slate-400">
        <span>Standard Educational Curriculum Edition</span>
        <span>Page {currentPageNumber} of {totalPages}</span>
      </div>
    </div>
  );
};
