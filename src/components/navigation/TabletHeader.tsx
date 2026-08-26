'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const TabletHeader: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Upload', href: '/upload', icon: 'upload_file' },
    { label: 'History', href: '/history', icon: 'history' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
  ];

  return (
    <header className="hidden md:flex lg:hidden justify-between items-center px-margin-desktop w-full h-touch-target bg-background border-b-2 border-surface-container-highest sticky top-0 z-40">
      <Link href="/" className="text-headline-md font-headline-md font-bold text-primary">
        AksharSetu
      </Link>
      <nav className="flex gap-6 h-full items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/upload' && pathname?.startsWith('/read'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 h-full px-2 text-label-md font-label-md transition-colors duration-200 ${
                isActive
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-on-surface-variant font-medium hover:bg-surface-container-low'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/language"
          aria-label="Language"
          className="flex items-center gap-2 h-full px-2 text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200"
        >
          <span className="material-symbols-outlined">language</span>
        </Link>
      </nav>
    </header>
  );
};
