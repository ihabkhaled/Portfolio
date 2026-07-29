import { afterEach, describe, expect, it, vi } from 'vitest';

import { publicEnv } from '@/packages/env';

describe('publicEnv', () => {
  it('provides validated defaults in the test environment', () => {
    expect(publicEnv.appEnv).toBe('local');
    expect(publicEnv.appUrl).toBe('http://localhost:3000');
  });
});

describe('getServerEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('parses and caches the server environment with defaults', async () => {
    const { getServerEnv } = await import('@/packages/env/server');
    const first = getServerEnv();

    expect(first.apiBaseUrl).toBe('http://localhost:4000');
    expect(first.apiMocking).toBe('enabled');
    expect(getServerEnv()).toBe(first);
  });

  it('honors provided values', async () => {
    vi.stubEnv('SERVER_API_BASE_URL', 'https://api.internal.example.com');
    vi.stubEnv('SERVER_API_MOCKING', 'disabled');
    vi.resetModules();

    const { getServerEnv } = await import('@/packages/env/server');
    const env = getServerEnv();

    expect(env.apiBaseUrl).toBe('https://api.internal.example.com');
    expect(env.apiMocking).toBe('disabled');
  });

  it('rejects malformed values instead of propagating them', async () => {
    vi.stubEnv('SERVER_API_BASE_URL', 'not-a-url');
    vi.resetModules();

    const { getServerEnv } = await import('@/packages/env/server');

    expect(() => getServerEnv()).toThrow(/server environment/);
  });

  it('trims a blank GitHub token down to null', async () => {
    const { getServerEnv } = await import('@/packages/env/server');

    expect(getServerEnv().githubToken).toBeNull();
  });

  it('keeps a real GitHub token', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'ghp_example');
    vi.resetModules();

    const { getServerEnv } = await import('@/packages/env/server');

    expect(getServerEnv().githubToken).toBe('ghp_example');
  });

  it('rejects an enabled contact channel with incomplete SMTP configuration', async () => {
    vi.stubEnv('CONTACT_EMAIL_ENABLED', 'true');
    vi.resetModules();

    const { getServerEnv } = await import('@/packages/env/server');
    const { SchemaParseError } = await import('@/packages/zod');

    expect(() => getServerEnv()).toThrow(SchemaParseError);

    let caughtError: unknown;
    try {
      getServerEnv();
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeInstanceOf(SchemaParseError);
    expect((caughtError as InstanceType<typeof SchemaParseError>).issues).toContainEqual(
      expect.objectContaining({
        message: 'Enabled contact email requires complete SMTP configuration',
      }),
    );
  });

  it('accepts an enabled contact channel with complete SMTP configuration', async () => {
    vi.stubEnv('CONTACT_EMAIL_ENABLED', 'true');
    vi.stubEnv('CONTACT_EMAIL_FROM', 'noreply@example.com');
    vi.stubEnv('CONTACT_EMAIL_TO', 'ihab@example.com');
    vi.stubEnv('CONTACT_SMTP_HOST', 'smtp.example.com');
    vi.stubEnv('CONTACT_SMTP_USER', 'smtp-user');
    vi.stubEnv('CONTACT_SMTP_PASS', 'smtp-pass');
    vi.resetModules();

    const { getServerEnv } = await import('@/packages/env/server');
    const env = getServerEnv();

    expect(env.contactEmail.enabled).toBe(true);
    expect(env.contactEmail.host).toBe('smtp.example.com');
  });

  it('resetServerEnvCache forces the next call to re-parse the environment', async () => {
    const { getServerEnv, resetServerEnvCache } = await import('@/packages/env/server');
    const first = getServerEnv();

    resetServerEnvCache();
    vi.stubEnv('SERVER_API_MOCKING', 'disabled');
    const second = getServerEnv();

    expect(second).not.toBe(first);
    expect(second.apiMocking).toBe('disabled');
  });
});
