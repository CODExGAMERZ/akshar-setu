'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DesktopSidebar } from '../navigation/DesktopSidebar';
import { TabletHeader } from '../navigation/TabletHeader';
import { MobileHeader } from '../navigation/MobileHeader';
import { MobileBottomNav } from '../navigation/MobileBottomNav';
import { ProfileReadyModal } from '../modals/ProfileReadyModal';
import { useReader } from '@/context/ReaderContext';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { profile } = useReader();

  const isStandalonePage = pathname === '/' || pathname === '/calibrate';

  if (isStandalonePage) {
    return (
      <div
        className="min-h-dvh w-full flex flex-col items-center justify-center"
        style={{
          backgroundColor: profile.backgroundColor,
          color: profile.textColor,
        }}
      >
        <div className="w-full flex-1 flex flex-col justify-center">{children}</div>
        <ProfileReadyModal />
      </div>
    );
  }

  return (
    <div
      className="min-h-dvh flex flex-col antialiased w-full relative"
      style={{
        backgroundColor: profile.backgroundColor,
        color: profile.textColor,
      }}
    >
      {/* Desktop Sidebar (lg screens only, fixed w-64) */}
      <DesktopSidebar />

      {/* Main Content Viewport: offsets by 64 (16rem) on large screens */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:pl-64 transition-all duration-150">
        {/* Tablet Header (md screens) */}
        <TabletHeader />

        {/* Mobile Header (mobile screens) */}
        <MobileHeader />

        {/* Dynamic Page Content with bottom padding for mobile navbar */}
        <main className="flex-1 pb-24 md:pb-12 lg:pb-8 w-full min-h-[calc(100dvh-4rem)]">
          {children}
        </main>

        {/* Mobile Bottom Navigation (mobile screens) */}
        <MobileBottomNav />
      </div>

      <ProfileReadyModal />
    </div>
  );
};
