/**
 * A best-effort client identifier for rate limiting. `x-forwarded-for` can
 * carry a comma-separated proxy chain; the first entry is the original
 * client. Falls back to a shared bucket when no proxy header is present,
 * which only matters for local development.
 */
export function resolveClientKey(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor !== null) {
    // A fixed-limit split on any string always returns >= 1 element; the
    // `?? 'unknown'` fallback exists only to satisfy noUncheckedIndexedAccess.
    // See docs/exceptions/EXC-0007-rate-limit-key-fallback-branch.md.
    /* v8 ignore next */
    return forwardedFor.split(',', 1)[0]?.trim() ?? 'unknown';
  }
  return headers.get('x-real-ip') ?? 'unknown';
}
