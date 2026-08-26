'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { session, signInWithGoogle } = useAuth();

  const navItems = [
    { label: 'Library', href: '/library', icon: 'local_library' },
    { label: 'Upload', href: '/upload', icon: 'upload_file' },
    { label: 'Reading Profile', href: '/profile', icon: 'tune' },
    { label: 'Calibration', href: '/calibrate', icon: 'psychology_alt' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
  ];

  return (
    <nav className="hidden lg:flex flex-col fixed left-0 top-0 h-full py-8 px-4 w-64 bg-surface-container-low border-r-2 border-surface-container-highest z-40">
      {/* Brand Header */}
      <div className="mb-8 px-4">
        <Link href="/" className="group block">
          <h1 className="text-xl font-bold text-primary group-hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_stories
            </span>
            <span>AksharSetu</span>
          </h1>
        </Link>
        <p className="text-xs text-on-surface-variant mt-1 font-medium">Multisensory Reading</p>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col gap-1.5 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/library' && pathname?.startsWith('/read'));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-bold translate-x-1 shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high font-medium'
                }`}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User Profile / Guest Footer */}
      <div className="mt-auto px-4 pt-4 border-t border-surface-container-highest flex items-center justify-between">
        {session.user ? (
          <div className="flex items-center gap-3">
            <img
              src={session.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'}
              alt={session.user.name}
              className="w-9 h-9 rounded-full border-2 border-outline-variant object-cover"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-on-surface truncate">{session.user.name}</p>
              <p className="text-[11px] text-on-surface-variant truncate">Synced</p>
            </div>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-2 text-xs font-bold text-primary hover:text-on-primary-fixed-variant transition-colors py-2 px-3 rounded-full bg-surface-container-highest w-full justify-center"
          >
            <span className="material-symbols-outlined text-sm">account_circle</span>
            Sign in (Guest)
          </button>
        )}
      </div>
    </nav>
  );
};
