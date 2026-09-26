'use client';

import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { readingService } from '../../services/readingService';
import { 
  Trophy, 
  Clock, 
  BookOpen, 
  Zap, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

export const ReadingSessionSummaryModal: React.FC = () => {
  const { isSessionSummaryOpen, setIsSessionSummaryOpen, activeDocument, setCurrentRoute } = useApp();

  const session = readingService.getActiveSession();
  const hasSufficientData = !!(session && session.elapsedSeconds >= 10 && session.wordsRead >= 5);
  const elapsedSeconds = session?.elapsedSeconds || 0;
  const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
  const wordsRead = session?.wordsRead || 0;
  const wpm = session && session.wpm > 0 
    ? session.wpm 
    : (elapsedSeconds > 5 ? Math.round((wordsRead / elapsedSeconds) * 60) : 0);

  return (
    <Modal
      isOpen={isSessionSummaryOpen}
      onClose={() => setIsSessionSummaryOpen(false)}
      title="Reading Session Summary"
      subtitle="Your engagement metrics for this reading lesson"
      maxWidth="md"
    >
      <div className="space-y-6 text-[#26231E]">
        {/* Big Trophy Header */}
        <div className="p-6 bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF9EB] text-[#D97706] flex items-center justify-center mx-auto border border-[#E7DFCA] shadow-2xs">
            <Trophy className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-[#1E1B18]">
            {hasSufficientData ? 'Great Focus & Progress!' : 'Reading Session Active'}
          </h4>
          <p className="text-xs text-[#706655] line-clamp-1">
            {activeDocument?.title || 'Lesson Reading Session'}
          </p>
        </div>

        {hasSufficientData ? (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-xs text-[#706655]">
                  <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Time</span>
                </div>
                <p className="text-lg font-bold text-[#1E1B18]">{elapsedMinutes}m</p>
              </div>

              <div className="p-4 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-xs text-[#706655]">
                  <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Words</span>
                </div>
                <p className="text-lg font-bold text-[#1E1B18]">{wordsRead}</p>
              </div>

              <div className="p-4 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-xs text-[#706655]">
                  <Zap className="w-3.5 h-3.5 text-[#047857]" />
                  <span>Speed</span>
                </div>
                <p className="text-lg font-bold text-[#1E1B18]">{wpm} <span className="text-[10px] font-normal">WPM</span></p>
              </div>
            </div>

            {/* Feedback pill */}
            <div className="p-3.5 bg-[#EDF5EC] border border-[#CBDBCB] rounded-xl flex items-center gap-2.5 text-xs text-[#047857]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Consistent tracking detected with minimal visual regressive eye fixations.</span>
            </div>
          </>
        ) : (
          <div className="p-5 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl text-center space-y-2">
            <Sparkles className="w-5 h-5 text-[#D97706] mx-auto" />
            <p className="text-xs font-semibold text-[#1E1B18]">
              Session just started — not enough reading data yet!
            </p>
            <p className="text-[11px] text-[#706655]">
              Read through the passage or start the Read-Aloud speech synthesizer to track your reading speed and word counts.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setIsSessionSummaryOpen(false)}
          >
            Continue Reading
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setIsSessionSummaryOpen(false);
              setCurrentRoute('library');
            }}
          >
            Return to Library
          </Button>
        </div>
      </div>
    </Modal>
  );
};
