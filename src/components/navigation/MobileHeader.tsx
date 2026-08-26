'use client';

import React from 'react';
import Link from 'next/link';

export const MobileHeader: React.FC = () => {
  return (
    <header className="md:hidden flex justify-between items-center px-margin-mobile h-touch-target bg-background border-b-2 border-surface-container-highest sticky top-0 z-40">
      <Link href="/" className="text-headline-lg-mobile font-headline-lg-mobile text-primary font-bold">
        AksharSetu
      </Link>
      <Link
        href="/language"
        aria-label="Language"
        className="flex items-center justify-center w-10 h-10 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors duration-200"
      >
        <span className="material-symbols-outlined">language</span>
      </Link>
    </header>
  );
};
