'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const TabletHeader: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Library', href: '/library', icon: 'local_library' },
    { label: 'Upload', href: '/upload', icon: 'upload_file' },
    { label: 'Profile', href: '/profile', icon: 'tune' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
  ];

  return (
    <header className="hidden md:flex lg:hidden justify-between items-center px-6 w-full h-16 bg-background border-b-2 border-surface-container-highest sticky top-0 z-40">
      <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
        <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_stories
        </span>
        <span>AksharSetu</span>
      </Link>
      <nav className="flex gap-4 h-full items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/library' && pathname?.startsWith('/read'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 h-full px-3 text-xs sm:text-sm font-bold transition-colors ${
                isActive
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
