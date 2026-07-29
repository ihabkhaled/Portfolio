import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createRateLimiter } from '../services/contact-rate-limiter.service';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-07-29T12:00:00.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('createRateLimiter', () => {
  it('allows requests up to the configured maximum', () => {
    const limiter = createRateLimiter(3, 60_000);

    expect(limiter.consume('client-a')).toBe(true);
    expect(limiter.consume('client-a')).toBe(true);
    expect(limiter.consume('client-a')).toBe(true);
  });

  it('blocks a request once the key is over budget within the window', () => {
    const limiter = createRateLimiter(2, 60_000);

    expect(limiter.consume('client-a')).toBe(true);
    expect(limiter.consume('client-a')).toBe(true);
    expect(limiter.consume('client-a')).toBe(false);
  });

  it('allows requests again once the window elapses', () => {
    const limiter = createRateLimiter(1, 60_000);

    expect(limiter.consume('client-a')).toBe(true);
    expect(limiter.consume('client-a')).toBe(false);

    vi.setSystemTime(new Date('2026-07-29T12:01:00.001Z'));

    expect(limiter.consume('client-a')).toBe(true);
  });

  it('tracks separate keys independently', () => {
    const limiter = createRateLimiter(1, 60_000);

    expect(limiter.consume('client-a')).toBe(true);
    expect(limiter.consume('client-b')).toBe(true);
    expect(limiter.consume('client-a')).toBe(false);
    expect(limiter.consume('client-b')).toBe(false);
  });
});
