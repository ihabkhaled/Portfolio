import 'server-only';

import type { RateLimiter } from '../types/rate-limiter.types';

/**
 * A fixed-window limiter per key (client IP), held in memory for the life of
 * the server process. This is deliberately simple: a portfolio contact form
 * does not need a distributed limiter, and one dead process resets to zero
 * false positives rather than leaking state across restarts.
 */
export function createRateLimiter(maxRequests: number, windowMs: number): RateLimiter {
  const hitsByKey = new Map<string, number[]>();

  return {
    consume(key) {
      const now = Date.now();
      const recentHits = (hitsByKey.get(key) ?? []).filter((hitAt) => now - hitAt < windowMs);

      if (recentHits.length >= maxRequests) {
        hitsByKey.set(key, recentHits);
        return false;
      }

      recentHits.push(now);
      hitsByKey.set(key, recentHits);
      return true;
    },
  };
}
