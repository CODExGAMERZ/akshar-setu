'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  RotateCcw, 
  FastForward 
} from 'lucide-react';
import { Button } from '../common/Button';

export const AudioDock: React.FC = () => {
  const { 
    ttsState, 
    startTTS, 
    pauseTTS, 
    resumeTTS, 
    stopTTS, 
    setTTSSpeed, 
    preferences 
  } = useApp();

  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

  const handleTogglePlay = () => {
    if (ttsState.isPlaying) {
      pauseTTS();
    } else if (ttsState.isPaused) {
      resumeTTS();
    } else {
      startTTS();
    }
  };

  const handleCycleSpeed = () => {
    const current = ttsState.playbackRate;
    const nextIdx = (speeds.indexOf(current) + 1) % speeds.length;
    setTTSSpeed(speeds[nextIdx] || 1.0);
  };

  return (
    <div 
      id="audio-dock-persistent"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#26231E] text-[#FEF9EB] px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 max-w-lg w-[92%] sm:w-auto transition-all animate-in fade-in slide-in-from-bottom-4"
    >
      {/* Speaker indicator */}
      <div className="flex items-center gap-2 pr-2 border-r border-white/15 shrink-0">
        <Volume2 className={`w-4 h-4 text-[#D97706] ${ttsState.isPlaying ? 'animate-pulse' : ''}`} />
        <span className="text-xs font-semibold hidden sm:inline">
          {ttsState.isPlaying ? 'Reading Aloud' : ttsState.isPaused ? 'Paused' : 'Read Aloud'}
        </span>
      </div>

      {/* Play / Pause main button */}
      <button
        id="audio-dock-play-pause-btn"
        onClick={handleTogglePlay}
        className="w-9 h-9 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs shrink-0"
        title={ttsState.isPlaying ? "Pause speech" : "Play speech"}
      >
        {ttsState.isPlaying ? (
          <Pause className="w-4 h-4 fill-white" />
        ) : (
          <Play className="w-4 h-4 fill-white ml-0.5" />
        )}
      </button>

      {/* Stop / Reset button */}
      {(ttsState.isPlaying || ttsState.isPaused) && (
        <button
          id="audio-dock-stop-btn"
          onClick={stopTTS}
          className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          title="Stop and reset speech"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>
      )}

      {/* Speed Selector Pill */}
      <button
        id="audio-dock-speed-btn"
        onClick={handleCycleSpeed}
        className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold transition-colors shrink-0"
        title="Cycle speech speed rate"
      >
        {ttsState.playbackRate}x
      </button>

      {/* Word reading metric indicator */}
      {ttsState.totalWords > 0 && (
        <div className="text-[11px] text-white/70 hidden md:block pl-2 border-l border-white/15">
          Word {ttsState.currentWordIndex + 1} of {ttsState.totalWords}
        </div>
      )}
    </div>
  );
};
