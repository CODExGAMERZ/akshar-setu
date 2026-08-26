'use client';

import React, { useEffect, useState } from 'react';

export const PwaInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('AksharSetu PWA ServiceWorker active:', reg.scope);
          })
          .catch((err) => {
            console.warn('ServiceWorker registration note:', err);
          });
      });
    }

    // 2. Check if already running in standalone (PWA) mode
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');

      if (isStandalone) {
        setIsInstalled(true);
      }
    }

    // 3. Listen for browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  return (
    <aside aria-label="Install App" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-surface-container-lowest border-2 border-primary/30 shadow-2xl rounded-2xl p-4 max-w-xs sm:max-w-sm flex items-center gap-3 backdrop-blur-md">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-md">
          <span className="material-symbols-outlined text-2xl">install_mobile</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-on-surface leading-tight">Install AksharSetu App</p>
          <p className="text-[11px] text-on-surface-variant line-clamp-1">Fast offline access on your home screen</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-primary text-on-primary rounded-full text-xs font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
          >
            Install
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-on-surface-variant hover:text-on-surface rounded-full"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
