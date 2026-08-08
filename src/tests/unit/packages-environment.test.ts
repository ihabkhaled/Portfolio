import { afterEach, describe, expect, it, vi } from 'vitest';

import { publicEnvironment } from '@/packages/env';

describe('publicEnvironment', () => {
  it('provides validated defaults in the test environment', () => {
    expect(publicEnvironment.appEnv).toBe('local');
    expect(publicEnvironment.appUrl).toBe('http://localhost:3000');
  });
});

describe('getServerEnvironment', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('parses and caches the server environment with defaults', async () => {
    const { getServerEnvironment } = await import('@/packages/env/server');
    const first = getServerEnvironment();

    expect(first.apiBaseUrl).toBe('http://localhost:4000');
    expect(first.apiMocking).toBe('disabled');
    expect(getServerEnvironment()).toBe(first);
  });

  it('honors provided values', async () => {
    vi.stubEnv('SERVER_API_BASE_URL', 'https://api.internal.example.com');
    vi.stubEnv('SERVER_API_MOCKING', 'disabled');
    vi.resetModules();

    const { getServerEnvironment } = await import('@/packages/env/server');
    const environment = getServerEnvironment();

    expect(environment.apiBaseUrl).toBe('https://api.internal.example.com');
    expect(environment.apiMocking).toBe('disabled');
  });

  it('rejects malformed values instead of propagating them', async () => {
    vi.stubEnv('SERVER_API_BASE_URL', 'not-a-url');
    vi.resetModules();

    const { getServerEnvironment } = await import('@/packages/env/server');

    expect(() => getServerEnvironment()).toThrow(/server environment/);
  });

  it('trims a blank GitHub token down to null', async () => {
    const { getServerEnvironment } = await import('@/packages/env/server');

    expect(getServerEnvironment().githubToken).toBeNull();
  });

  it('keeps a real GitHub token', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'ghp_example');
    vi.resetModules();

    const { getServerEnvironment } = await import('@/packages/env/server');

    expect(getServerEnvironment().githubToken).toBe('ghp_example');
  });

  it('rejects an enabled contact channel with incomplete SMTP configuration', async () => {
    vi.stubEnv('CONTACT_EMAIL_ENABLED', 'true');
    vi.resetModules();

    const { getServerEnvironment } = await import('@/packages/env/server');
    const { SchemaParseError } = await import('@/packages/zod');

    expect(() => getServerEnvironment()).toThrow(SchemaParseError);

    let caughtError: unknown;
    try {
      getServerEnvironment();
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

    const { getServerEnvironment } = await import('@/packages/env/server');
    const environment = getServerEnvironment();

    expect(environment.contactEmail.enabled).toBe(true);
    expect(environment.contactEmail.host).toBe('smtp.example.com');
  });

  it('resetServerEnvironmentCache forces the next call to re-parse the environment', async () => {
    const { getServerEnvironment, resetServerEnvironmentCache } =
      await import('@/packages/env/server');
    const first = getServerEnvironment();

    resetServerEnvironmentCache();
    vi.stubEnv('SERVER_API_MOCKING', 'disabled');
    const second = getServerEnvironment();

    expect(second).not.toBe(first);
    expect(second.apiMocking).toBe('disabled');
  });
});
