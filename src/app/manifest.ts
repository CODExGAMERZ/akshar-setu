import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AksharSetu — Accessible Multisensory Reader',
    short_name: 'AksharSetu',
    description: 'Personalized multisensory accessible reader with dyslexia support, typography calibration, anti-glare color filters, and synchronized TTS.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FEF9EB',
    theme_color: '#FEF9EB',
    categories: ['education', 'accessibility', 'books', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Open Reader',
        short_name: 'Reader',
        description: 'Open the personalized accessible reader',
        url: '/read',
      },
      {
        name: 'Visual Calibration',
        short_name: 'Calibrate',
        description: 'Run the 8-step visual comfort calibration test',
        url: '/calibrate',
      },
      {
        name: 'Document Library',
        short_name: 'Library',
        description: 'Browse, upload, and organize reading lessons',
        url: '/library',
      },
    ],
  };
}
