'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const ProfileReadyModal: React.FC = () => {
  const router = useRouter();
  const { isProfileReadyModalOpen, setIsProfileReadyModalOpen, signInWithGoogle, continueAsGuest } = useAuth();

  if (!isProfileReadyModalOpen) return null;

  const handleSignIn = () => {
    signInWithGoogle();
    router.push('/upload');
  };

  const handleMaybeLater = () => {
    continueAsGuest();
    router.push('/upload');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Background Overlay */}
      <div
        className="fixed inset-0 bg-inverse-surface opacity-80 z-40 transition-opacity duration-300"
        onClick={() => setIsProfileReadyModalOpen(false)}
      />

      {/* Modal Container */}
      <main className="relative z-50 w-full max-w-md max-h-[90dvh] overflow-y-auto bg-surface-container-lowest rounded-xl border border-surface-container-highest flex flex-col p-8 items-center text-center shadow-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Icon/Illustration */}
        <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mb-6">
          <span
            className="material-symbols-outlined text-primary text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>

        {/* Headlines */}
        <h1 className="text-headline-lg-mobile font-headline-lg-mobile md:text-headline-lg md:font-headline-lg text-primary mb-4">
          Your profile is ready!
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant mb-8 max-w-[280px]">
          Sign in with Google to keep it, plus your documents and history
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={handleSignIn}
            className="flex items-center justify-center gap-3 w-full h-touch-target rounded-full bg-surface-container text-on-surface text-label-md font-label-md border border-outline-variant hover:bg-surface-container-highest transition-colors duration-200"
            type="button"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            Sign in with Google
          </button>
          <button
            onClick={handleMaybeLater}
            className="w-full h-touch-target rounded-full bg-transparent text-primary text-label-md font-label-md hover:bg-surface-container-low transition-colors duration-200"
            type="button"
          >
            Maybe later, just this once
          </button>
        </div>
      </main>
    </div>
  );
};
