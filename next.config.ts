import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/packages/i18n/request.ts');

/**
 * Vercel injects VERCEL_ENV/VERCEL_URL/VERCEL_PROJECT_PRODUCTION_URL
 * automatically at build time, but NEXT_PUBLIC_APP_ENV/NEXT_PUBLIC_APP_URL
 * are ours to set. Two ways that goes wrong, both silent (no error, no
 * crash — the app just quietly ships wrong URLs):
 *   1. Never set on Vercel at all → falls back to the local-dev schema
 *      defaults ('local' / http://localhost:3000).
 *   2. Set on Vercel, but copied verbatim from a local .env file that
 *      itself points at localhost (exactly what happened here).
 * Either way, the sitemap/robots/OG metadata ship with localhost URLs, and
 * the PWA service worker never registers (gated on appEnv === 'production').
 * If we can positively detect we're running on Vercel (VERCEL_ENV is only
 * ever set by Vercel's own build system, never by a developer), a
 * still-localhost NEXT_PUBLIC_APP_URL is never correct — override it. A
 * real, intentional custom-domain value is never a localhost origin, so
 * this can't clobber a legitimate configuration.
 */
function isUnsetOrLocalhost(value: string | undefined): boolean {
  if (!value) return true;
  try {
    return ['localhost', '127.0.0.1'].includes(new URL(value).hostname);
  } catch {
    return true;
  }
}

function resolveNextPublicAppEnv(): string | undefined {
  const vercelEnv = process.env['VERCEL_ENV'];
  if (vercelEnv === undefined) return undefined;
  const currentAppEnv = process.env['NEXT_PUBLIC_APP_ENV'];
  if (currentAppEnv && currentAppEnv !== 'local') return undefined;
  if (vercelEnv === 'production') return 'production';
  if (vercelEnv === 'preview') return 'staging';
  return undefined;
}

function resolveNextPublicAppUrl(): string | undefined {
  const vercelEnv = process.env['VERCEL_ENV'];
  if (vercelEnv === undefined) return undefined;
  if (!isUnsetOrLocalhost(process.env['NEXT_PUBLIC_APP_URL'])) return undefined;
  const productionUrl = process.env['VERCEL_PROJECT_PRODUCTION_URL'];
  if (vercelEnv === 'production' && productionUrl) {
    return `https://${productionUrl}`;
  }
  const previewUrl = process.env['VERCEL_URL'];
  if (previewUrl) return `https://${previewUrl}`;
  return undefined;
}

/**
 * Baseline security headers applied to every route.
 * The Content-Security-Policy header is nonce-based and therefore lives in
 * `src/proxy.ts`, where a fresh nonce is generated per request.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const resolvedAppEnv = resolveNextPublicAppEnv();
const resolvedAppUrl = resolveNextPublicAppUrl();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  turbopack: {},
  env: {
    ...(resolvedAppEnv === undefined ? {} : { NEXT_PUBLIC_APP_ENV: resolvedAppEnv }),
    ...(resolvedAppUrl === undefined ? {} : { NEXT_PUBLIC_APP_URL: resolvedAppUrl }),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.example.com',
      },
    ],
  },
  headers() {
    return Promise.resolve([
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]);
  },
  rewrites() {
    return Promise.resolve({
      beforeFiles: [{ source: '/', destination: '/en' }],
      afterFiles: [],
      fallback: [],
    });
  },
};

export default withNextIntl(nextConfig);
