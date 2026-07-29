import { describe, expect, it } from 'vitest';

import { resolveClientKey } from '../helpers/request-client-key.helper';

describe('resolveClientKey', () => {
  it('uses the first entry of a comma-separated x-forwarded-for chain', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.4, 10.0.0.1, 10.0.0.2' });
    expect(resolveClientKey(headers)).toBe('203.0.113.4');
  });

  it('trims whitespace around the first forwarded entry', () => {
    const headers = new Headers({ 'x-forwarded-for': '  203.0.113.4  ,10.0.0.1' });
    expect(resolveClientKey(headers)).toBe('203.0.113.4');
  });

  it('falls back to x-real-ip when x-forwarded-for is absent', () => {
    const headers = new Headers({ 'x-real-ip': '198.51.100.7' });
    expect(resolveClientKey(headers)).toBe('198.51.100.7');
  });

  it('falls back to "unknown" when neither header is present', () => {
    expect(resolveClientKey(new Headers())).toBe('unknown');
  });
});
