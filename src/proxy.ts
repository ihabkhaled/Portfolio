import { NextResponse, type NextRequest } from 'next/server';

/**
 * Per-request nonce-based Content-Security-Policy. Next.js reads the CSP from
 * the forwarded request headers and stamps the nonce onto its inline scripts.
 * The remaining security headers are static and live in next.config.ts.
 */
function buildContentSecurityPolicy(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const scriptSource = isDevelopment
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  return [
    `default-src 'self'`,
    `script-src ${scriptSource}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data: https://*.googlesyndication.com https://*.google.com`,
    `font-src 'self'`,
    `worker-src 'self'`,
    `connect-src 'self' https://*.googlesyndication.com https://*.google.com https://ep1.adtrafficquality.google`,
    `frame-src 'self' https://*.googlesyndication.com https://googleads.g.doubleclick.net`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

export default function proxy(request: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', contentSecurityPolicy);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('content-security-policy', contentSecurityPolicy);

  return response;
}

export const config = {
  matcher: [
    {
      /*
      Static assets and prefetches keep default headers.
      */
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
