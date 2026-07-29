/**
 * A best-effort client identifier for rate limiting. `x-forwarded-for` can
 * carry a comma-separated proxy chain; the first entry is the original
 * client. Falls back to a shared bucket when no proxy header is present,
 * which only matters for local development.
 */
export function resolveClientKey(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor !== null) {
    return forwardedFor.split(',', 1)[0]?.trim() ?? 'unknown';
  }
  return headers.get('x-real-ip') ?? 'unknown';
}
