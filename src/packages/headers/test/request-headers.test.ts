import { describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

const { headers } = await import('next/headers');
const { getRequestNonce } = await import('../request-headers');

describe('getRequestNonce', () => {
  it('returns the x-nonce header value when present', async () => {
    vi.mocked(headers).mockResolvedValue(
      new Headers({ 'x-nonce': 'MjIyMjIyMjItMzMzMy00NDQ0LTU1NTUtNjY2NjY2NjY2NjY2' }),
    );

    expect(await getRequestNonce()).toBe('MjIyMjIyMjItMzMzMy00NDQ0LTU1NTUtNjY2NjY2NjY2NjY2');
  });

  it('returns undefined when the header is absent', async () => {
    vi.mocked(headers).mockResolvedValue(new Headers());

    expect(await getRequestNonce()).toBeUndefined();
  });
});
