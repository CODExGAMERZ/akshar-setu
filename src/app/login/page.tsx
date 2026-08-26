'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithGoogle, continueAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMockEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      signInWithGoogle(); // Mock login simulation
      setIsLoading(false);
      router.push('/library');
    }, 600);
  };

  const handleGoogleLogin = () => {
    signInWithGoogle();
    router.push('/library');
  };

  const handleGuest = () => {
    continueAsGuest();
    router.push('/library');
  };

  return (
    <div className="bg-background text-on-background min-h-dvh flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 w-full">
      <main className="w-full max-w-md bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border-2 border-surface-container-highest shadow-sm flex flex-col gap-6">
        <header className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container text-primary flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_stories
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Welcome to AksharSetu</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Sign in to access your personalized reading documents and saved settings.
          </p>
        </header>

        {/* Mock Form */}
        <form onSubmit={handleMockEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full p-3 bg-surface-bright border-2 border-surface-container-highest rounded-xl text-sm text-on-background focus:border-primary focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-3 bg-surface-bright border-2 border-surface-container-highest rounded-xl text-sm text-on-background focus:border-primary focus:ring-0"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[3rem] bg-primary text-on-primary rounded-full font-bold text-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 shadow-sm touch-target"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-surface-container-highest"></div>
          <span className="flex-shrink mx-4 text-xs font-medium text-on-surface-variant">or continue with</span>
          <div className="flex-grow border-t border-surface-container-highest"></div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full min-h-[3rem] bg-surface-bright border-2 border-surface-container-highest rounded-full px-6 py-2.5 hover:bg-surface-container-low transition-all font-bold text-xs sm:text-sm text-on-surface touch-target"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <span>Sign in with Google</span>
        </button>

        {/* Guest Mode */}
        <button
          type="button"
          onClick={handleGuest}
          className="text-center text-xs sm:text-sm font-bold text-primary hover:underline py-1"
        >
          Continue as Guest (No Login Required)
        </button>
      </main>
    </div>
  );
}
