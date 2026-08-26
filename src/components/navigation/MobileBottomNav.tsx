'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Upload', href: '/upload', icon: 'upload_file' },
    { label: 'History', href: '/history', icon: 'history' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
    { label: 'Language', href: '/language', icon: 'language' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-background/95 backdrop-blur-md border-t-2 border-surface-container-highest md:hidden shadow-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/upload' && pathname?.startsWith('/read'));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 min-w-[4.25rem] min-h-[3.25rem] rounded-xl transition-all duration-150 active:scale-95 ${
              isActive
                ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-xs font-bold mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
