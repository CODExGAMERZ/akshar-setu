'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  SkipBack, 
  SkipForward, 
  Gauge 
} from 'lucide-react';

export const AudioDock: React.FC = () => {
  const { 
    ttsState, 
    startTTS, 
    pauseTTS, 
    resumeTTS, 
    stopTTS, 
    setTTSSpeed, 
    skipSentenceForward, 
    skipSentenceBackward 
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
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#26231E]/95 backdrop-blur-md text-[#FEF9EB] px-4 py-2.5 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-2.5 max-w-xl w-[94%] sm:w-auto transition-all animate-in fade-in slide-in-from-bottom-4"
    >
      {/* Speaker indicator & soundwave animation */}
      <div className="flex items-center gap-2 pr-2.5 border-r border-white/15 shrink-0">
        <Volume2 className={`w-4 h-4 text-[#D97706] ${ttsState.isPlaying ? 'animate-bounce' : ''}`} />
        <div className="flex items-end gap-0.5 h-3.5">
          <span className={`w-1 bg-[#D97706] rounded-full transition-all duration-150 ${ttsState.isPlaying ? 'h-3.5 animate-pulse' : 'h-1'}`} />
          <span className={`w-1 bg-[#FDE047] rounded-full transition-all duration-200 ${ttsState.isPlaying ? 'h-2.5 animate-pulse' : 'h-1'}`} />
          <span className={`w-1 bg-[#D97706] rounded-full transition-all duration-150 ${ttsState.isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
        </div>
        <span className="text-xs font-semibold hidden md:inline">
          {ttsState.isPlaying ? 'Reading' : ttsState.isPaused ? 'Paused' : 'Read Aloud'}
        </span>
      </div>

      {/* Skip Backward Button */}
      <button
        id="audio-dock-skip-back-btn"
        onClick={skipSentenceBackward}
        className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        title="Previous sentence"
      >
        <SkipBack className="w-4 h-4" />
      </button>

      {/* Play / Pause main button */}
      <button
        id="audio-dock-play-pause-btn"
        onClick={handleTogglePlay}
        className="w-10 h-10 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white flex items-center justify-center transition-transform active:scale-95 shadow-md shrink-0"
        title={ttsState.isPlaying ? "Pause speech" : "Play speech"}
      >
        {ttsState.isPlaying ? (
          <Pause className="w-4 h-4 fill-white" />
        ) : (
          <Play className="w-4 h-4 fill-white ml-0.5" />
        )}
      </button>

      {/* Skip Forward Button */}
      <button
        id="audio-dock-skip-fwd-btn"
        onClick={skipSentenceForward}
        className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        title="Next sentence"
      >
        <SkipForward className="w-4 h-4" />
      </button>

      {/* Stop / Reset button */}
      {(ttsState.isPlaying || ttsState.isPaused) && (
        <button
          id="audio-dock-stop-btn"
          onClick={stopTTS}
          className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          title="Stop and reset speech"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      )}

      {/* Speed Selector Pill */}
      <button
        id="audio-dock-speed-btn"
        onClick={handleCycleSpeed}
        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold transition-colors shrink-0"
        title="Cycle speech playback rate"
      >
        <Gauge className="w-3 h-3 text-[#D97706]" />
        <span>{ttsState.playbackRate}x</span>
      </button>

      {/* Word reading metric indicator */}
      {ttsState.totalWords > 0 && (
        <div className="text-[11px] text-white/80 hidden sm:block pl-2 border-l border-white/15 truncate max-w-[120px]">
          Word {Math.max(1, ttsState.currentWordIndex + 1)} of {ttsState.totalWords}
        </div>
      )}
    </div>
  );
};
