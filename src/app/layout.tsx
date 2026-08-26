import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { ReaderProvider } from '@/context/ReaderContext';
import { AuthProvider } from '@/context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { PwaInstaller } from '@/components/pwa/PwaInstaller';

export const metadata: Metadata = {
  title: 'AksharSetu — Accessible Personalized Multisensory Reading Assistant',
  description: 'A personalized, multilingual reading companion for people with dyslexia. Read in the way that works for you.',
  applicationName: 'AksharSetu',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AksharSetu',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#064192',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Curated Dyslexia-Friendly & Web Accessibility Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Lexend:wght@300..700&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300..800&family=Roboto:ital,wght@0,300;0,400;0,700;1,400&family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Nunito:ital,wght@0,300..800;1,400&family=Nunito+Sans:ital,opsz,wght@0,6..12,300..800;1,6..12,400&family=Source+Sans+3:ital,wght@0,300..800;1,400&family=Ubuntu:ital,wght@0,300;0,400;0,700;1,400&family=PT+Sans:ital,wght@0,400;0,700;1,400&display=swap"
        />
        {/* OpenDyslexic Web Font CDN fallback */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/font-opendyslexic@1.0.3/open-dyslexic.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="font-sans antialiased min-h-dvh selection:bg-secondary-container selection:text-on-secondary-container bg-surface-main text-on-surface">
        <AuthProvider>
          <ReaderProvider>
            <AppShell>{children}</AppShell>
            <PwaInstaller />
          </ReaderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
