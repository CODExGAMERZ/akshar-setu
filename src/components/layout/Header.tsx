'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Sliders, 
  Sparkles, 
  UploadCloud, 
  User as UserIcon, 
  HelpCircle,
  FileText,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const { 
    currentRoute, 
    setCurrentRoute, 
    activeDocument, 
    currentUser, 
    setIsUploadModalOpen,
    setIsHowItWorksOpen,
    ttsState,
    startTTS,
    stopTTS
  } = useApp();

  return (
    <header 
      id="main-app-header"
      className="sticky top-0 z-40 bg-[#FEF9EB]/90 backdrop-blur-md border-b border-[#E7DFCA] px-4 lg:px-8 py-3 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link
            id="brand-logo-btn"
            href="/"
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#26231E] text-[#FEF9EB] flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-serif">A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-[#26231E] tracking-tight">AksharSetu</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FAF1DA] text-[#8C6D23] border border-[#E4D5AD]">
                  Ivory
                </span>
              </div>
              <p className="text-[11px] text-[#786E5E] hidden sm:block">
                Accessible Multisensory Reader
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#FAF3E0] p-1 rounded-xl border border-[#E7DFCA]">
          <Link
            id="nav-home-btn"
            href="/"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRoute === 'landing' 
                ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs' 
                : 'text-[#4A4338] hover:text-[#26231E] hover:bg-[#EFE8D6]'
            }`}
          >
            Overview
          </Link>

          <Link
            id="nav-library-btn"
            href="/library"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentRoute === 'library' 
                ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs' 
                : 'text-[#4A4338] hover:text-[#26231E] hover:bg-[#EFE8D6]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Library
          </Link>

          {activeDocument && (
            <Link
              id="nav-reader-btn"
              href={`/read/${activeDocument.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentRoute === 'reader' 
                  ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs' 
                  : 'text-[#4A4338] hover:text-[#26231E] hover:bg-[#EFE8D6]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Reader
            </Link>
          )}

          <Link
            id="nav-calibration-btn"
            href="/calibrate"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentRoute === 'calibration' 
                ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs' 
                : 'text-[#4A4338] hover:text-[#26231E] hover:bg-[#EFE8D6]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            Calibration
          </Link>

          <Link
            id="nav-profile-btn"
            href="/profile"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentRoute === 'profile' 
                ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs' 
                : 'text-[#4A4338] hover:text-[#26231E] hover:bg-[#EFE8D6]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Profile
          </Link>
        </nav>


        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick TTS Button when on reader */}
          {currentRoute === 'reader' && (
            <Button
              id="header-tts-quick-btn"
              variant={ttsState.isPlaying ? 'accent' : 'outline'}
              size="sm"
              icon={<Volume2 className={`w-4 h-4 ${ttsState.isPlaying ? 'animate-pulse' : ''}`} />}
              onClick={() => {
                if (ttsState.isPlaying) {
                  stopTTS();
                } else {
                  startTTS();
                }
              }}
            >
              <span className="hidden sm:inline">
                {ttsState.isPlaying ? 'Speaking...' : 'Read Aloud'}
              </span>
            </Button>
          )}

          {/* Upload Button */}
          <Button
            id="header-upload-btn"
            variant="outline"
            size="sm"
            icon={<UploadCloud className="w-4 h-4 text-[#D97706]" />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            <span className="hidden sm:inline">Upload Doc</span>
          </Button>

          {/* How It Works Button */}
          <button
            id="header-help-btn"
            aria-label="How AksharSetu works"
            onClick={() => setIsHowItWorksOpen(true)}
            className="p-2 rounded-xl text-[#786E5E] hover:text-[#26231E] hover:bg-[#FAF3E0] transition-colors border border-transparent hover:border-[#E7DFCA]"
          >
            <HelpCircle className="w-4 h-4" />
          </button>


          {/* User Profile / Mock Login Badge */}
          {currentUser ? (
            <button
              id="header-user-btn"
              onClick={() => setCurrentRoute('profile')}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#FAF3E0] hover:bg-[#EFE8D6] border border-[#E7DFCA] transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-[#26231E] text-[#FEF9EB] text-[10px] font-bold flex items-center justify-center">
                {currentUser.avatar}
              </div>
              <span className="text-xs font-semibold text-[#26231E] hidden md:inline">
                {currentUser.name}
              </span>
            </button>
          ) : (
            <Button
              id="header-login-btn"
              variant="primary"
              size="sm"
              icon={<UserIcon className="w-3.5 h-3.5" />}
              onClick={() => setCurrentRoute('login')}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
