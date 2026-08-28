'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

export const FocusModeOverlay: React.FC = () => {
  const { preferences, ttsState } = useApp();
  const [mouseY, setMouseY] = useState<number>(-1000);

  useEffect(() => {
    if (!preferences.readingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [preferences.readingRuler]);

  // Synchronize ruler with spoken word if user isn't actively moving mouse
  useEffect(() => {
    if (preferences.readingRuler && ttsState.isPlaying && ttsState.currentWordIndex >= 0) {
      const activeEl = document.getElementById(`word-span-${ttsState.currentWordIndex}`);
      if (activeEl) {
        const rect = activeEl.getBoundingClientRect();
        setMouseY(rect.top + rect.height / 2);
      }
    }
  }, [ttsState.currentWordIndex, ttsState.isPlaying, preferences.readingRuler]);

  if (!preferences.readingRuler) return null;

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      id="reading-ruler-overlay"
    >
      {/* Visual Reading Ruler Guide */}
      <div 
        className="w-full transition-transform duration-100 ease-out"
        style={{
          height: `${preferences.rulerHeight || 70}px`,
          transform: `translateY(${mouseY - ((preferences.rulerHeight || 70) / 2)}px)`,
          borderTop: '2px solid rgba(217, 119, 6, 0.5)',
          borderBottom: '2px solid rgba(217, 119, 6, 0.5)',
          backgroundColor: 'rgba(253, 224, 71, 0.09)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.06)'
        }}
      />
    </div>
  );
};
