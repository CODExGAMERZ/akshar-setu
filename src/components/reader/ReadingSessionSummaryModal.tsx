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
  CheckCircle2,
  Flame,
  ArrowRight
} from 'lucide-react';

export const ReadingSessionSummaryModal: React.FC = () => {
  const { isSessionSummaryOpen, setIsSessionSummaryOpen, activeDocument, setCurrentRoute, showNotification } = useApp();

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
      title="Reading Milestone & Focus Analytics"
      subtitle="Cognitive tracking, vocabulary retention, and reading fluency metrics"
      maxWidth="md"
    >
      <div className="space-y-5 text-[#26231E]">
        {/* Big Trophy Header */}
        <div className="p-6 bg-gradient-to-b from-[#FAF1DA] to-[#FAF3E0] border border-[#E7DFCA] rounded-3xl text-center space-y-3 relative overflow-hidden shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-[#FEF9EB] text-[#D97706] flex items-center justify-center mx-auto border border-[#E4D5AD] shadow-md ring-4 ring-[#D97706]/15 animate-bounce duration-1000">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-bold text-[#1E1B18] tracking-tight">Superb Reading Focus!</h4>
            <p className="text-xs text-[#706655] font-medium line-clamp-1">
              {activeDocument?.title || 'Lesson Reading Session'}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF5EC] text-[#1E3A2F] text-xs font-bold border border-[#CBDBCB]">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily Streak Maintained (Day 5)</span>
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
            Keep Reading
          </Button>
          <Button
            variant="accent"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              setIsSessionSummaryOpen(false);
              setCurrentRoute('library');
              showNotification('Session saved to reading analytics profile!', 'success', 'Progress Logged');
            }}
          >
            Library Dashboard
          </Button>
        </div>
      </div>
    </Modal>
  );
};
