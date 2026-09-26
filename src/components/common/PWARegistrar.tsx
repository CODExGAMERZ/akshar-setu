'use client';

import { useEffect } from 'react';

export const PWARegistrar: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('AksharSetu PWA Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('AksharSetu PWA Service Worker registration notification:', error);
          });
      });
    }
  }, []);

  return null;
};
