'use client';

import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Languages, 
  Glasses, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const LandingPage: React.FC = () => {
  const { 
    setCurrentRoute, 
    setIsHowItWorksOpen, 
    documents, 
    navigateToReader,
    setIsAssessmentModalOpen 
  } = useApp();

  const sampleDoc = documents[0];

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#FEF9EB] text-[#26231E] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Subtle researched pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF1DA] border border-[#E4D5AD] text-xs font-semibold text-[#8C6D23]">
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse"></span>
            Ivory Clarity Accessible Reading Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1E1B18] leading-[1.15]">
            Read in the way that <span className="underline decoration-[#D97706]/40 decoration-wavy decoration-2">works for you</span>.
          </h1>

          <p className="text-lg sm:text-xl text-[#524B40] leading-relaxed max-w-2xl mx-auto">
            Personalize text, colors, spacing, language, focus and audio to create a reading experience that works for you.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              id="landing-start-reading-btn"
              variant="primary"
              size="lg"
              icon={<BookOpen className="w-5 h-5" />}
              onClick={() => {
                if (sampleDoc) {
                  navigateToReader(sampleDoc.id);
                } else {
                  setCurrentRoute('library');
                }
              }}
            >
              Start Reading
            </Button>

            <Button
              id="landing-calibrate-btn"
              variant="accent"
              size="lg"
              icon={<Sparkles className="w-5 h-5" />}
              onClick={() => setCurrentRoute('calibration')}
            >
              Calibrate Reading (5 Steps)
            </Button>

            <Button
              id="landing-how-it-works-btn"
              variant="outline"
              size="lg"
              onClick={() => setIsHowItWorksOpen(true)}
            >
              How It Works
            </Button>
          </div>

          {/* Optional assessment note */}
          <div className="pt-2">
            <button
              id="landing-assessment-link"
              onClick={() => setIsAssessmentModalOpen(true)}
              className="text-xs text-[#706655] hover:text-[#26231E] underline decoration-dotted transition-colors"
            >
              Have an optional educator assessment or prescription? Upload it here (Optional)
            </button>
          </div>
        </div>

        {/* Live Interactive Reading Demonstration Card */}
        <div className="mt-14 max-w-4xl mx-auto bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7DFCA] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#706655]">
                Active Personalized Sample Preview
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-[#FEF9EB] text-[#26231E] font-medium border border-[#E7DFCA]">
                Font: Lexend
              </span>
              <span className="px-2 py-0.5 rounded bg-[#FEF9EB] text-[#26231E] font-medium border border-[#E7DFCA]">
                Warm Parchment #FEF9EB
              </span>
              <span className="px-2 py-0.5 rounded bg-[#FEF9EB] text-[#26231E] font-medium border border-[#E7DFCA]">
                Word-by-Word Audio Sync
              </span>
            </div>
          </div>

          {/* Sample reading reflow block */}
          <div 
            className="p-6 rounded-xl bg-[#FEF9EB] border border-[#E7DFCA] text-[#26231E] text-lg sm:text-xl leading-[1.9] tracking-wide"
            style={{ fontFamily: "'Lexend', sans-serif" }}
          >
            <p>
              &ldquo;The <span className="bg-[#FDE047] text-[#1E1B18] px-1 rounded font-medium">honeybee</span> dances in graceful circles to tell her hive where the sweetest nectar flowers grow. Notice how the <span className="font-bold border-b-2 border-[#D97706]/60">b</span>right <span className="font-bold border-b-2 border-[#D97706]/60">d</span>awn sunlight warms the delicate petals without harsh glare.&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#706655] pt-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-[#26231E]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Reduced Visual Glare
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[#26231E]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                b / d Letter Disambiguation
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[#26231E]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                WCAG AA Contrast Compliant
              </span>
            </div>
            {sampleDoc && (
              <Button
                variant="secondary"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => navigateToReader(sampleDoc.id)}
              >
                Open Full Text in Reader
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-[#FAF3E0] border-t border-[#E7DFCA] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B18]">
              Designed for Comfort, Focus, and Comprehension
            </h2>
            <p className="text-sm text-[#706655]">
              Every tool is engineered to reduce ocular fatigue and support multisensory learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="p-6 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FAF1DA] text-[#D97706] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1E1B18]">Personalized Reading & Calibration</h3>
              <p className="text-xs text-[#524B40] leading-relaxed">
                Take a 5-step calibration test to discover your optimal font family, letter spacing, line height, and color tint.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EDF5EC] text-[#047857] flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1E1B18]">Synchronized Read Aloud</h3>
              <p className="text-xs text-[#524B40] leading-relaxed">
                Listen with natural speech synthesis while each spoken word lights up in real-time with automated smooth scrolling.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EEF4F8] text-[#1E40AF] flex items-center justify-center">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1E1B18]">Multilingual Reading</h3>
              <p className="text-xs text-[#524B40] leading-relaxed">
                Read and listen across English, Hindi, Marathi, Tamil, Telugu, and more without resetting your personalized typography.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FAF1DA] text-[#B45309] flex items-center justify-center">
                <Glasses className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1E1B18]">Confusable Letter Distinctions</h3>
              <p className="text-xs text-[#524B40] leading-relaxed">
                Subtly weight or color mirror pairs (b/d, p/q, m/w) to eliminate letter flips and directional confusion.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FDF2EB] text-[#C2410C] flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1E1B18]">Distraction-Free Focus Mode</h3>
              <p className="text-xs text-[#524B40] leading-relaxed">
                Engage reading rulers, spotlight masking, and line trackers to keep your eyes locked on the current sentence.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-[#FEF9EB] border border-[#E7DFCA] rounded-2xl space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EDF5EC] text-[#15803D] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1E1B18]">Original vs Reflowed Views</h3>
              <p className="text-xs text-[#524B40] leading-relaxed">
                Switch effortlessly between original textbook page layouts and custom reflowed typography without altering the source.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E7DFCA] py-6 px-4 text-center text-xs text-[#706655]">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <p>© 2026 LexiEase. &ldquo;Your reading environment should adapt to you.&rdquo;</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentRoute('library')} className="hover:underline">Library</button>
            <button onClick={() => setCurrentRoute('calibration')} className="hover:underline">Calibration</button>
            <button onClick={() => setCurrentRoute('profile')} className="hover:underline">Preferences</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
