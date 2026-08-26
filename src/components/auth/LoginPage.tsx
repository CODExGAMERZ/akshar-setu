'use client';

import React, { useState } from 'react';
import { User, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { User as UserType } from '../../types';

export const LoginPage: React.FC = () => {
  const { loginUser, setCurrentRoute } = useApp();
  const [email, setEmail] = useState('alex.rivera@edu.org');
  const [name, setName] = useState('Alex Rivera');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoAccounts: UserType[] = [
    {
      id: 'user_alex',
      name: 'Alex Rivera',
      email: 'alex.rivera@edu.org',
      avatar: 'AR',
      role: 'student',
      createdAt: '2026-01-15'
    },
    {
      id: 'user_maya',
      name: 'Maya Patel',
      email: 'maya.patel@school.org',
      avatar: 'MP',
      role: 'student',
      createdAt: '2026-02-10'
    },
    {
      id: 'user_sharma',
      name: 'Prof. Ananya Sharma',
      email: 'ananya.sharma@academy.org',
      avatar: 'AS',
      role: 'educator',
      createdAt: '2026-01-02'
    }
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const user: UserType = {
        id: `user_${Date.now()}`,
        name: name || 'Demo Reader',
        email: email || 'reader@aksharsetu.org',
        avatar: (name || 'DR').substring(0, 2).toUpperCase(),

        role: 'student',
        createdAt: new Date().toISOString()
      };
      loginUser(user);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#FEF9EB] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FEF9EB] border border-[#D8CEB9] text-sm text-[#26231E] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
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
                placeholder="you@school.org"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FEF9EB] border border-[#D8CEB9] text-sm text-[#26231E] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
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

        {/* Demo Quick Accounts */}
        <div className="space-y-3 pt-2 border-t border-[#E7DFCA]">
          <p className="text-[11px] font-semibold text-[#706655] uppercase tracking-wider text-center">
            Or quick demo switch:
          </p>
          <div className="space-y-2">
            {demoAccounts.map(demo => (
              <button
                key={demo.id}
                type="button"
                onClick={() => loginUser(demo)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#FEF9EB] hover:bg-[#EFE8D6] border border-[#E7DFCA] transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#26231E] text-[#FEF9EB] text-xs font-bold flex items-center justify-center">
                    {demo.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#26231E]">{demo.name}</p>
                    <p className="text-[10px] text-[#706655] capitalize">{demo.role}</p>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-[#10B981]" />
              </button>
            ))}
          </div>
        </div>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setCurrentRoute('landing')}
            className="text-xs text-[#706655] hover:text-[#26231E] underline"
          >
            Continue as Guest without signing in
          </button>
        </div>
      </div>
    </div>
  );
};
