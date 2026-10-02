'use client';

import React, { useState } from 'react';
import { User, Lock, ArrowRight, UserCheck, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { User as UserType } from '../../types';

export const LoginPage: React.FC = () => {
  const { loginUser, setCurrentRoute } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const user: UserType = {
        id: `user_${Date.now()}`,
        name: name.trim() || 'Reader',
        email: email.trim() || 'reader@aksharsetu.org',
        avatar: (name.trim() || 'AS').substring(0, 2).toUpperCase(),
        role: 'student',
        createdAt: new Date().toISOString()
      };
      loginUser(user);
      setIsSubmitting(false);
    }, 250);
  };

  const handleContinueAsGuest = () => {
    const guestUser: UserType = {
      id: `guest_${Date.now()}`,
      name: 'Guest Reader',
      email: 'guest@aksharsetu.org',
      avatar: 'GR',
      role: 'student',
      createdAt: new Date().toISOString()
    };
    loginUser(guestUser);
  };

  return (
    <div className="min-h-[calc(100dvh-70px)] bg-[#FEF9EB] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#FAF3E0] border border-[#E7DFCA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#26231E] text-[#FEF9EB] flex items-center justify-center font-bold text-xl mx-auto shadow-xs">
            A
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B18]">Welcome to AksharSetu</h2>
          <p className="text-xs text-[#706655]">
            Sign in to load your personalized reading profile, saved documents, and calibration preferences.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#26231E]" htmlFor="login-name">
              Your Name
            </label>
            <div className="relative">
              <input
                id="login-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FEF9EB] border border-[#D8CEB9] text-sm text-[#26231E] placeholder:text-[#8C7A5D]/60 focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
              />
              <User className="w-4 h-4 text-[#8C7A5D] absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#26231E]" htmlFor="login-email">
              Email Address
            </label>
            <div className="relative">
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FEF9EB] border border-[#D8CEB9] text-sm text-[#26231E] placeholder:text-[#8C7A5D]/60 focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
              />
              <Lock className="w-4 h-4 text-[#8C7A5D] absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5"
            disabled={isSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In to Profile'}
          </Button>
        </form>

        {/* Guest Onboarding Option */}
        <div className="pt-4 border-t border-[#E7DFCA] text-center space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full py-2.5 border-[#D8CEB9] text-[#26231E]"
            onClick={handleContinueAsGuest}
            icon={<Compass className="w-4 h-4 text-[#D97706]" />}
          >
            Continue as Guest
          </Button>

          <p className="text-[11px] text-[#706655]">
            No account required. You can calibrate and read documents immediately.
          </p>
        </div>
      </div>
    </div>
  );
};
