import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ihab Khaled — Senior Software Engineer',
    short_name: 'Ihab Khaled',
    description: 'Backend, full-stack and integrations engineering portfolio and CV.',
    start_url: '/en',
    scope: '/',
    display: 'standalone',
    background_color: '#f7f8fa',
    theme_color: '#2258d8',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
