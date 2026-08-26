'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();

  const handleStartReading = () => {
    router.push('/library');
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: 'tune',
      title: 'Personalized Reading',
      description: 'Choose from 22 research-backed and purpose-built dyslexia fonts, custom character spacing, and anti-glare pastel canvases.',
    },
    {
      icon: 'translate',
      title: 'Multilingual Reading',
      description: 'Seamlessly switch across 11 Indian languages while retaining your unique typographic and color comfort profile.',
    },
    {
      icon: 'volume_up',
      title: 'Read Aloud & Karaoke',
      description: 'Listen with synchronized word-by-word highlighted playback, sentence navigation, and custom speech rates (0.5x to 2x).',
    },
    {
      icon: 'center_focus_strong',
      title: 'Focus Mode',
      description: 'Eliminate distractions with a clean centered column, dimmed background, and digital reading ruler assistance.',
    },
    {
      icon: 'rule',
      title: 'Confusable Letter Markers',
      description: 'Enable subtle visual cues for commonly inverted letter pairs such as b/d, p/q, and m/w to ease phonics decoding.',
    },
    {
      icon: 'psychology_alt',
      title: 'Reading Calibration',
      description: 'Take a quick 5-round visual comparison test to automatically discover your ideal font, contrast, and spacing configuration.',
    },
    {
      icon: 'format_align_left',
      title: 'Adaptive Formatting',
      description: 'Auto-chunks dense text into digestible sections with bold 1.5× headings and strict left-alignment to prevent eye fatigue.',
    },
    {
      icon: 'palette',
      title: 'Accessible Anti-Glare Colors',
      description: 'Six verified WCAG AAA color palettes including Warm Cream, Soft Sage, and Slate Blue, plus a custom theme builder.',
    },
  ];

  return (
    <div className="bg-background text-on-background min-h-dvh flex flex-col w-full selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-20 md:py-28 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs sm:text-sm font-bold mb-6 border border-primary/20 animate-in fade-in">
          <span className="material-symbols-outlined text-base text-primary">verified</span>
          Accessible Multisensory Reading Assistant
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight max-w-3xl leading-tight mb-6">
          Read in the way that works for you.
        </h1>

        <p className="text-base sm:text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-10">
          Personalize text, colors, spacing, language, focus and audio to create a reading experience that adapts to your unique visual comfort.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleStartReading}
            className="w-full sm:w-auto min-h-[3.25rem] px-8 py-3.5 rounded-full bg-primary text-on-primary font-bold text-base hover:bg-on-primary-fixed-variant transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2.5 touch-target"
          >
            <span>Start Reading</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>

          <button
            type="button"
            onClick={scrollToFeatures}
            className="w-full sm:w-auto min-h-[3.25rem] px-8 py-3.5 rounded-full bg-surface-container-high text-on-surface font-bold text-base hover:bg-surface-container-highest transition-colors active:scale-95 flex items-center justify-center gap-2 touch-target"
          >
            <span>How It Works</span>
            <span className="material-symbols-outlined text-xl">expand_more</span>
          </button>
        </div>

        {/* Non-medical promise badge */}
        <p className="text-xs text-on-surface-variant/80 mt-6 max-w-lg">
          Designed for accessibility and comfort. Adapts your reading environment without diagnostic or medical claims.
        </p>
      </section>

      {/* Feature Highlights Grid */}
      <section id="how-it-works" className="w-full bg-surface-container-lowest border-y-2 border-surface-container-highest py-16 sm:py-24">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-on-surface mb-3">
              Crafted for Clarity, Focus & Comfort
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant">
              Every detail is engineered based on dyslexia typography research and WCAG 2.1 accessibility guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="bg-surface-bright rounded-2xl p-6 border-2 border-surface-container-highest hover:border-primary/50 transition-all flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-secondary-container text-primary flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Launch / Assessment Banner */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 text-center">
        <div className="bg-surface-container-low rounded-3xl p-6 sm:p-10 md:p-12 border-2 border-surface-container-highest flex flex-col items-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-3">autorenew</span>
          <h3 className="text-xl sm:text-3xl font-bold text-primary mb-2">
            Want your settings tailored in 2 minutes?
          </h3>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mb-6">
            Try our interactive reading calibration or upload an optional prescription/assessment report.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/calibrate"
              className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 touch-target"
            >
              <span className="material-symbols-outlined text-lg">psychology_alt</span>
              Start Visual Calibration
            </Link>
            <Link
              href="/onboarding/assessment"
              className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 touch-target"
            >
              <span className="material-symbols-outlined text-lg">upload_file</span>
              Optional Assessment Flow
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
