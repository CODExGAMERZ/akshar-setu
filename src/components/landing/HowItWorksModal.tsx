'use client';

import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Volume2, 
  Glasses, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';

export const HowItWorksModal: React.FC = () => {
  const { isHowItWorksOpen, setIsHowItWorksOpen, setCurrentRoute } = useApp();

  const steps = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#D97706]" />,
      title: "1. Visual Calibration (5 Minutes)",
      desc: "Take a 5-step interactive comparison test. Discover your personal sweet spot across research-backed fonts (Lexend, Atkinson Hyperlegible, OpenDyslexic), line spacing, and soothing pastel tints."
    },
    {
      icon: <BookOpen className="w-5 h-5 text-[#2563EB]" />,
      title: "2. Digitize Lessons or PDFs",
      desc: "Upload textbook chapters or homework assignments. Our accessible OCR reflows dense columns into a clean, single reading stream without altering original images."
    },
    {
      icon: <Volume2 className="w-5 h-5 text-[#047857]" />,
      title: "3. Multisensory Read-Along",
      desc: "Listen with natural Text-to-Speech while active words light up with karaoke synchronization. Control playback rate (0.5x to 2x) and jump to any sentence."
    },
    {
      icon: <Glasses className="w-5 h-5 text-[#B45309]" />,
      title: "4. Confusable Letter Cues",
      desc: "Subtly highlight mirror letters like b/d, p/q, and m/w with customizable weighting, colors, or under-dots to prevent letter-flip reversals."
    }
  ];

  return (
    <Modal
      isOpen={isHowItWorksOpen}
      onClose={() => setIsHowItWorksOpen(false)}
      title="How LexiEase Works"
      subtitle="Accessible Multisensory Reading Assistant"
      maxWidth="xl"
    >
      <div className="space-y-6 text-[#26231E]">
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-4 p-4 rounded-xl bg-[#FAF3E0] border border-[#E7DFCA]"
            >
              <div className="p-2 rounded-xl bg-[#FEF9EB] border border-[#E7DFCA] shrink-0">
                {step.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#1E1B18]">{step.title}</h4>
                <p className="text-xs text-[#524B40] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Non-Medical Disclaimer */}
        <div className="p-4 rounded-xl bg-[#FAF1DA] border border-[#E4D5AD] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#8C6D23] shrink-0 mt-0.5" />
          <div className="text-xs text-[#706655] space-y-1">
            <p className="font-bold text-[#1E1B18]">Accessibility & Comfort Platform</p>
            <p>
              LexiEase adapts your visual reading environment. It is an assistive educational tool and makes no diagnostic or clinical claims.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setIsHowItWorksOpen(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            icon={<Sparkles className="w-4 h-4" />}
            onClick={() => {
              setIsHowItWorksOpen(false);
              setCurrentRoute('calibration');
            }}
          >
            Start Reading Calibration
          </Button>
        </div>
      </div>
    </Modal>
  );
};
