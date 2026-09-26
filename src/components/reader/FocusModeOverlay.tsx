'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

export const FocusModeOverlay: React.FC = () => {
  const { preferences, updatePreferences } = useApp();
  const [mouseY, setMouseY] = useState<number>(-1000);
  const [showAutoToast, setShowAutoToast] = useState<boolean>(false);

  useEffect(() => {
    if (preferences.readingRuler) {
      setShowAutoToast(true);
      const timer = setTimeout(() => setShowAutoToast(false), 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!preferences.readingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [preferences.readingRuler]);

  if (!preferences.readingRuler) return null;

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
      id="reading-ruler-overlay"
    >
      {/* Auto-enabled toast indicator */}
      {showAutoToast && (
        <div className="pointer-events-auto fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#26231E]/95 text-[#FEF9EB] px-3.5 py-2 rounded-xl shadow-lg border border-white/10 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <span>Reading ruler enabled from your settings</span>
          <button
            onClick={() => setShowAutoToast(false)}
            className="text-white/60 hover:text-white text-xs font-bold"
            aria-label="Dismiss notice"
          >
            ✕
          </button>
        </div>
      )}
      {/* Visual Reading Ruler Guide */}
      <div 
        className="w-full relative transition-transform duration-75 ease-out"
        style={{
          height: `${preferences.rulerHeight}px`,
          transform: `translateY(${mouseY - (preferences.rulerHeight / 2)}px)`,
          borderTop: '2px solid rgba(217, 119, 6, 0.4)',
          borderBottom: '2px solid rgba(217, 119, 6, 0.4)',
          backgroundColor: 'rgba(253, 224, 71, 0.08)',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.04)'
        }}
      >
        <button
          onClick={() => updatePreferences({ readingRuler: false })}
          title="Turn off reading ruler"
          aria-label="Close reading ruler"
          className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-[#26231E]/80 hover:bg-[#26231E] text-[#FEF9EB] text-[10px] font-semibold flex items-center gap-1 shadow-sm transition-all"
        >
          <span>✕ Close Ruler</span>
        </button>
      </div>
    </div>
  );
};
