import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { HowItWorksModal } from '@/components/landing/HowItWorksModal';
import { DocumentUploaderModal } from '@/components/documents/DocumentUploaderModal';
import { AssessmentUploadModal } from '@/components/documents/AssessmentUploadModal';
import { SpeechDictationModal } from '@/components/reader/SpeechDictationModal';

export const metadata: Metadata = {
  title: 'AksharSetu — Personalized Multisensory Reading Assistant',
  description: 'Accessible dyslexia-support reading assistant with personalized typography, color overlays, read-aloud synchronization, and focus modes.',
  applicationName: 'AksharSetu',
};


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#FEF9EB',
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
        <link 
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Comic+Neue:ital,wght@0,400;0,700;1,400&family=Lexend:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" 
          rel="stylesheet" 
        />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/opendyslexic@2.0.0/dist/opendyslexic.min.css" 
        />
      </head>
      <body className="min-h-screen bg-[#FEF9EB] text-[#26231E] flex flex-col font-sans selection:bg-[#FDE047] selection:text-[#1E1B18] antialiased">
        <AppProvider>
          <Header />
          <main className="flex-1 flex flex-col pt-[65px]">
            {children}
          </main>
          <HowItWorksModal />
          <DocumentUploaderModal />
          <AssessmentUploadModal />
          <SpeechDictationModal />
        </AppProvider>
      </body>
    </html>
  );
}
