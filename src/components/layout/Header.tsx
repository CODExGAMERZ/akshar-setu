'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Sliders, 
  Sparkles, 
  UploadCloud, 
  User as UserIcon, 
  HelpCircle,
  FileText,
  Volume2,
  Menu,
  X,
  Mic,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { 
    currentRoute, 
    setCurrentRoute, 
    activeDocument, 
    currentUser, 
    setIsUploadModalOpen,
    setIsHowItWorksOpen,
    setIsDictationModalOpen,
    ttsState,
    startTTS,
    stopTTS,
    notifications,
    removeNotification
  } = useApp();

  return (
    <header 
      id="main-app-header"
      className="fixed top-0 left-0 right-0 w-full z-50 bg-[#FEF9EB]/90 backdrop-blur-md border-b border-[#E7DFCA] px-4 lg:px-8 py-3 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link
            id="brand-logo-btn"
            href="/"
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center bg-[#26231E]">
              <img 
                src="/icons/icon.svg" 
                alt="AksharSetu Brand Logo" 
                className="w-full h-full object-cover" 
              />
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

          {/* Voice Dictation Button */}
          <Button
            id="header-dictation-btn"
            variant="outline"
            size="sm"
            icon={<Mic className="w-4 h-4 text-[#D97706]" />}
            onClick={() => setIsDictationModalOpen(true)}
            title="Speech Dictation & Voice Translation"
          >
            <span className="hidden sm:inline">Voice Dictation</span>
          </Button>

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

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-[#786E5E] hover:text-[#26231E] hover:bg-[#FAF3E0] transition-colors border border-transparent hover:border-[#E7DFCA]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#FEF9EB] border-b border-[#E7DFCA] shadow-lg flex flex-col p-4 gap-2 z-50">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              currentRoute === 'landing' 
                ? 'bg-[#26231E] text-[#FEF9EB]' 
                : 'text-[#4A4338] hover:text-[#26231E] hover:bg-[#EFE8D6]'
            }`}
          >
            Overview
          </Link>
          <Link
            href="/library"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              currentRoute === 'library' 
                ? 'bg-[#26231E] text-[#FEF9EB]' 
                : 'text-[#4A4338] hover:text-[#26231E] hover:bg-[#EFE8D6]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Library
          </Link>
          {activeDocument && (
            <Link
              href={`/read/${activeDocument.id}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                currentRoute === 'reader' 
                  ? 'bg-[#26231E] text-[#FEF9EB]' 
                  : 'text-[#4A4338] hover:text-[#26231E] hover:bg-[#EFE8D6]'
              }`}
            >
              <FileText className="w-4 h-4" />
              Reader
            </Link>
          )}
          <Link
            href="/calibrate"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              currentRoute === 'calibration' 
                ? 'bg-[#26231E] text-[#FEF9EB]' 
                : 'text-[#4A4338] hover:text-[#26231E] hover:bg-[#EFE8D6]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            Calibration
          </Link>
          <Link
            href="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              currentRoute === 'profile' 
                ? 'bg-[#26231E] text-[#FEF9EB]' 
                : 'text-[#4A4338] hover:text-[#26231E] hover:bg-[#EFE8D6]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Profile
          </Link>
        </div>
      )}

      {/* Floating Global Toast Notifications Stack */}
      {notifications && notifications.length > 0 && (
        <div 
          aria-live="polite"
          className="fixed top-20 right-4 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-[92vw] pointer-events-none"
        >
          {notifications.map((n) => {
            const isSuccess = n.type === 'success';
            const isError = n.type === 'error';
            const isWarning = n.type === 'warning';
            const isInfo = n.type === 'info' || !n.type;

            return (
              <div
                key={n.id}
                role="alert"
                className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-[#26231E]/95 text-[#FEF9EB] border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/30 transition-all animate-in fade-in slide-in-from-top-3 duration-200 overflow-hidden relative group"
              >
                {/* Accent strip */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isSuccess ? 'bg-emerald-500' :
                    isError ? 'bg-rose-500' :
                    isWarning ? 'bg-amber-500' : 'bg-sky-500'
                  }`}
                />

                {/* Icon */}
                <div className="shrink-0 pt-0.5 pl-1">
                  {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                  {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  {isInfo && <Info className="w-5 h-5 text-sky-400" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  {n.title && (
                    <p className="text-xs font-bold tracking-tight text-white mb-0.5">
                      {n.title}
                    </p>
                  )}
                  <p className="text-xs text-[#EFE8D6] leading-relaxed break-words font-medium">
                    {n.message}
                  </p>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={() => removeNotification(n.id)}
                  className="shrink-0 text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Bottom timer progress bar */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 h-0.5 opacity-40 ${
                    isSuccess ? 'bg-emerald-400' :
                    isError ? 'bg-rose-400' :
                    isWarning ? 'bg-amber-400' : 'bg-sky-400'
                  }`}
                />
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
};
