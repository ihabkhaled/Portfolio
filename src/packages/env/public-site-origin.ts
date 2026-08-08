export function parsePublicSiteOrigin(
  value: string,
  environment: 'local' | 'test' | 'staging' | 'production',
): string {
  const url = new URL(value);
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error(
      'NEXT_PUBLIC_APP_URL must be an origin without credentials, path, query, or hash.',
    );
  }
  const isLocalHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isPermitsLocalHttp = (environment === 'local' || environment === 'test') && isLocalHost;
  if (!isPermitsLocalHttp && url.protocol !== 'https:') {
    throw new Error('NEXT_PUBLIC_APP_URL must use HTTPS outside local development.');
  }
  return url.origin;
}
