'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Library', href: '/library', icon: 'local_library' },
    { label: 'Upload', href: '/upload', icon: 'upload_file' },
    { label: 'Profile', href: '/profile', icon: 'tune' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-background/95 backdrop-blur-md border-t-2 border-surface-container-highest md:hidden shadow-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/library' && pathname?.startsWith('/read'));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 min-w-[4rem] min-h-[3.25rem] rounded-xl transition-all duration-150 active:scale-95 touch-target ${
              isActive
                ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[11px] font-bold mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
