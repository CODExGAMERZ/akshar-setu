'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { session, signInWithGoogle } = useAuth();

  const navItems = [
    { label: 'Upload', href: '/upload', icon: 'upload_file' },
    { label: 'History', href: '/history', icon: 'history' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
    { label: 'Language', href: '/language', icon: 'language' },
  ];

  return (
    <nav className="hidden lg:flex flex-col fixed left-0 top-0 h-full py-8 px-4 w-64 bg-surface-container-low border-r-2 border-surface-container-highest z-40">
      {/* Brand Header */}
      <div className="mb-8 px-4">
        <Link href="/" className="group">
          <h1 className="text-headline-md font-headline-md font-bold text-primary group-hover:opacity-90 transition-opacity">
            AksharSetu
          </h1>
        </Link>
        <p className="text-label-md font-label-md text-on-surface-variant mt-1">Reading Assistant</p>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/upload' && pathname?.startsWith('/read'));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-label-md font-label-md transition-all duration-150 ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-bold translate-x-1 shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high font-medium'
                }`}
              >
                <span
                  className="material-symbols-outlined text-2xl"
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
              src={session.user.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl_paqyHow3TF4FMuOEd-jBCVh9QODPv3mjePU1fjo0T8fGtp2Fq1cSM7hh_VgH9tRo2LgFLr5xMSa9N_4V4sD6OevLo3equYdsAeHm72hH5W_Srllx_6amIo47HFfe6B_KEOkr3uNecRBC5akytzgdyI4-VmeF45MVSYmj0W7KH4AzCweZK8chtyylP0Q22mcAkOK-ZqGJAtvzN-ghf2I-OQcxmoXY-40Mfly5SXdFrpvjBv3Tmspfg'}
              alt={session.user.name}
              className="w-10 h-10 rounded-full border-2 border-outline-variant object-cover"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-on-surface truncate">{session.user.name}</p>
              <p className="text-xs text-on-surface-variant truncate">Synced</p>
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
