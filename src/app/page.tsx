'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function WelcomePage() {
  const router = useRouter();
  const { signInWithGoogle, continueAsGuest } = useAuth();

  const handleGoogleSignIn = () => {
    signInWithGoogle();
    router.push('/calibrate');
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    router.push('/calibrate');
  };

  return (
    <div className="bg-background text-on-background min-h-dvh flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 w-full">
      <main className="w-full max-w-md flex flex-col gap-6 sm:gap-8 bg-surface-container-lowest sm:p-8 md:p-10 rounded-2xl sm:border-2 sm:border-surface-container-highest sm:shadow-sm">
        <header className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-primary text-4xl sm:text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_stories
            </span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary font-bold">
              AksharSetu
            </h1>
          </div>
          <h2 className="font-headline-md text-base sm:text-headline-md text-on-surface font-bold">
            Reading, calibrated for you
          </h2>
        </header>

        <section className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6">
          {/* Sign in with Google */}
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3 w-full min-h-[3.25rem] bg-surface-container-lowest border-2 border-outline-variant rounded-full px-6 py-3 hover:bg-surface-container-low transition-all duration-200 shadow-sm group active:scale-95 touch-target"
          >
            <svg className="w-6 h-6 group-hover:scale-105 transition-transform shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-label-md text-sm sm:text-label-md text-on-surface font-bold">
              Sign in with Google
            </span>
          </button>

          {/* Continue as guest */}
          <button
            onClick={handleGuestContinue}
            className="w-full min-h-[3.25rem] text-center px-6 py-3 text-primary hover:text-on-primary-fixed-variant transition-colors duration-200 rounded-full hover:bg-surface-container-low active:scale-95 touch-target"
          >
            <span className="font-label-md text-sm sm:text-label-md font-bold">Continue as guest</span>
          </button>
        </section>

        <footer className="mt-4 sm:mt-6 border-t border-surface-container-highest pt-4">
          <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant leading-relaxed text-center sm:text-left">
            Guest mode works fully — sign in any time to save your profile, documents, and history.
          </p>
        </footer>
      </main>
    </div>
  );
}
