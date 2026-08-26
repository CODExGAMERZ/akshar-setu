'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

export const FocusModeOverlay: React.FC = () => {
  const { preferences } = useApp();
  const [mouseY, setMouseY] = useState<number>(-1000);

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
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      id="reading-ruler-overlay"
    >
      {/* Visual Reading Ruler Guide */}
      <div 
        className="w-full transition-transform duration-75 ease-out"
        style={{
          height: `${preferences.rulerHeight}px`,
          transform: `translateY(${mouseY - (preferences.rulerHeight / 2)}px)`,
          borderTop: '2px solid rgba(217, 119, 6, 0.4)',
          borderBottom: '2px solid rgba(217, 119, 6, 0.4)',
          backgroundColor: 'rgba(253, 224, 71, 0.08)',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.04)'
        }}
      />
    </div>
  );
};
