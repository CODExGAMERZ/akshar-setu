'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { GripVertical, X } from 'lucide-react';

interface FocusModeOverlayProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({ containerRef }) => {
  const { preferences, updatePreferences } = useApp();
  const [rulerY, setRulerY] = useState<number>(180);
  const [isHovering, setIsHovering] = useState<boolean>(true);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const internalRef = useRef<HTMLDivElement>(null);

  const rulerHeight = Math.max(40, Math.min(160, preferences.rulerHeight || 80));
  const dimOpacity = Math.max(0.1, Math.min(0.8, preferences.spotlightDim ?? 0.35));
  const rulerTint = preferences.rulerColor || 'rgba(217, 119, 6, 0.12)';
  const rulerBorderColor = preferences.rulerColor ? preferences.rulerColor.replace(/[\d\.]+\)$/, '0.6)') : 'rgba(217, 119, 6, 0.5)';

  // Detect touch device on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
      setIsTouchDevice(isTouch);
      if (isTouch) {
        // Default to a comfortable reading band (approx 35% down viewport)
        setRulerY(window.innerHeight * 0.3);
      }
    }
  }, []);

  // Keyboard navigation for accessibility: ArrowUp / ArrowDown
  useEffect(() => {
    if (!preferences.readingRuler) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'ArrowDown' && (e.altKey || e.ctrlKey || e.shiftKey)) {
        e.preventDefault();
        setRulerY(prev => Math.min(prev + (e.shiftKey ? 48 : 24), 2000));
        setIsHovering(true);
      } else if (e.key === 'ArrowUp' && (e.altKey || e.ctrlKey || e.shiftKey)) {
        e.preventDefault();
        setRulerY(prev => Math.max(prev - (e.shiftKey ? 48 : 24), 20));
        setIsHovering(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [preferences.readingRuler]);

  // Pointer follow logic tied to reading container
  useEffect(() => {
    if (!preferences.readingRuler) return;

    const target = containerRef?.current || internalRef.current?.parentElement || document.getElementById('reading-canvas-container');
    if (!target) return;

    const handlePointerMove = (e: PointerEvent) => {
      // On touch devices, prefer scroll or drag handle so user can read naturally
      if (isTouchDevice && !isDragging) return;

      const rect = target.getBoundingClientRect();
      const clientY = e.clientY;
      const clientX = e.clientX;

      // Check if cursor is inside document area bounds
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        setIsHovering(true);
        const relativeY = clientY - rect.top;
        setRulerY(relativeY);
      } else {
        if (!isTouchDevice) {
          setIsHovering(false);
        }
      }
    };

    const handlePointerLeave = () => {
      if (!isTouchDevice) {
        setIsHovering(false);
      }
    };

    const handlePointerEnter = () => {
      setIsHovering(true);
    };

    target.addEventListener('pointermove', handlePointerMove as EventListener);
    target.addEventListener('pointerleave', handlePointerLeave);
    target.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      target.removeEventListener('pointermove', handlePointerMove as EventListener);
      target.removeEventListener('pointerleave', handlePointerLeave);
      target.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, [preferences.readingRuler, containerRef, isTouchDevice, isDragging]);

  // Touch drag handle logic for mobile/tablet
  const handleDragStart = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    const target = containerRef?.current || internalRef.current?.parentElement;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const handleMove = (moveEvent: PointerEvent) => {
      const relativeY = moveEvent.clientY - rect.top;
      setRulerY(Math.max(20, Math.min(relativeY, rect.height - 20)));
    };

    const handleUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }, [containerRef]);

  if (!preferences.readingRuler) return null;

  return (
    <div
      ref={internalRef}
      id="reading-ruler-overlay"
      aria-label="Dyslexia Reading Ruler"
      className={`pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-200 ${
        isHovering || isTouchDevice ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ minHeight: '100%' }}
    >
      {/* Top Dim Mask (Above Ruler) */}
      <div
        className="w-full absolute top-0 left-0 transition-all duration-75 ease-out"
        style={{
          height: `${Math.max(0, rulerY - rulerHeight / 2)}px`,
          backgroundColor: '#000000',
          opacity: dimOpacity
        }}
      />

      {/* Optical Reading Band (The Clear Guide Window) */}
      <div
        className="w-full absolute left-0 flex items-center justify-between px-3 sm:px-6 transition-all duration-75 ease-out"
        style={{
          top: `${Math.max(0, rulerY - rulerHeight / 2)}px`,
          height: `${rulerHeight}px`,
          borderTop: `2px solid ${rulerBorderColor}`,
          borderBottom: `2px solid ${rulerBorderColor}`,
          backgroundColor: rulerTint,
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Left: Drag Handle (Visible on Touch devices) */}
        {isTouchDevice ? (
          <div
            onPointerDown={handleDragStart}
            className="pointer-events-auto cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-[#26231E]/80 text-[#FEF9EB] hover:bg-[#26231E] flex items-center gap-1 text-[11px] font-bold shadow-md select-none touch-none"
            title="Drag reading band"
          >
            <GripVertical className="w-4 h-4 text-[#D97706]" />
            <span className="text-[10px] hidden sm:inline">Drag Band</span>
          </div>
        ) : (
          <div className="w-4" />
        )}

        {/* Right: Close Ruler Button (Strictly inside reading canvas) */}
        <button
          onClick={() => updatePreferences({ readingRuler: false })}
          title="Turn off reading ruler"
          aria-label="Close reading ruler"
          className="pointer-events-auto px-2 py-1 rounded-md bg-[#26231E]/85 hover:bg-[#26231E] text-[#FEF9EB] text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <X className="w-3.5 h-3.5 text-[#FDE047]" />
          <span>Close Ruler</span>
        </button>
      </div>

      {/* Bottom Dim Mask (Below Ruler) */}
      <div
        className="w-full absolute left-0 bottom-0 transition-all duration-75 ease-out"
        style={{
          top: `${rulerY + rulerHeight / 2}px`,
          backgroundColor: '#000000',
          opacity: dimOpacity
        }}
      />
    </div>
  );
};
