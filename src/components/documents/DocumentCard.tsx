'use client';

import React from 'react';
import { Document } from '../../types';
import { Button } from '../common/Button';
import { BookOpen, Clock, FileText, Trash2, ArrowRight } from 'lucide-react';

export interface DocumentCardProps {
  document: Document;
  onOpen: () => void;
  onDelete?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onOpen,
  onDelete
}) => {
  const categoryColors: Record<string, string> = {
    Science: 'bg-[#EDF5EC] text-[#047857] border-[#CBDBCB]',
    History: 'bg-[#FAF1DA] text-[#B45309] border-[#E4D5AD]',
    English: 'bg-[#EEF4F8] text-[#1E40AF] border-[#CADCE6]',
    Mathematics: 'bg-[#FDF2EB] text-[#C2410C] border-[#E8D0C0]',
    General: 'bg-[#FAF3E0] text-[#706655] border-[#E7DFCA]'
  };

  const badgeClass = categoryColors[document.category] || categoryColors.General;

  return (
    <div 
      className="bg-[#FEF9EB] border border-[#E7DFCA] hover:border-[#D97706]/60 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group space-y-4"
    >
      <div className="space-y-3">
        {/* Top meta */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${badgeClass}`}>
            {document.category}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-[#706655]">
            <Clock className="w-3 h-3" />
            <span>{document.estimatedReadTimeMinutes} min read</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={onOpen}
          className="font-bold text-base text-[#1E1B18] group-hover:text-[#D97706] transition-colors cursor-pointer line-clamp-2 leading-snug"
        >
          {document.title}
        </h3>

        {/* Preview snippet */}
        <p className="text-xs text-[#524B40] line-clamp-3 leading-relaxed">
          {document.pages[0]?.content || 'Educational content ready for accessible reading reflow.'}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-[#E7DFCA] space-y-3">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-semibold text-[#706655]">
            <span>Reading Progress</span>
            <span>{document.progressPercent}%</span>
          </div>
          <div className="w-full bg-[#E7DFCA] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#10B981] h-full transition-all duration-300 rounded-full"
              style={{ width: `${document.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${document.title}" from your library?`)) {
                  onDelete();
                }
              }}
              title="Delete document"
              className="p-1.5 rounded-lg text-[#706655] hover:text-[#DC2626] hover:bg-[#FAF3E0] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={onOpen}
          >
            Open Reader
          </Button>
        </div>
      </div>
    </div>
  );
};
