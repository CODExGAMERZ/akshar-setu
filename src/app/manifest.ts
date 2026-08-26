import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AksharSetu — Dyslexia Reading Companion',
    short_name: 'AksharSetu',
    description: 'A personalized, multilingual reading companion for people with dyslexia and reading differences.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#fbf9f8',
    theme_color: '#064192',
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
        name: 'Read Document',
        short_name: 'Read',
        description: 'Open the personalized reader',
        url: '/read',
      },
      {
        name: 'Calibration Test',
        short_name: 'Calibrate',
        description: 'Tune your visual reading profile',
        url: '/calibrate',
      },
      {
        name: 'Upload Document',
        short_name: 'Upload',
        description: 'Import a new PDF or text',
        url: '/upload',
      },
    ],
  };
}
