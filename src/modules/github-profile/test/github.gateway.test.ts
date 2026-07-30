import { afterEach, describe, expect, it, vi } from 'vitest';

import { resetServerEnvCache } from '@/packages/env/server';
import { http, HttpResponse } from '@/tests/msw/handler-tools';
import { mswServer } from '@/tests/msw/server';

import { GITHUB_API_ORIGIN } from '../constants/github.constants';
import { fetchRepositorySnapshot } from '../gateway/github.gateway';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  resetServerEnvCache();
});

describe('fetchRepositorySnapshot', () => {
  it('returns a normalized snapshot for a successful response', async () => {
    const snapshot = await fetchRepositorySnapshot('ihabkhaled', 'ClawAI');

    expect(snapshot).not.toBeNull();
    expect(snapshot?.name).toBe('ClawAI');
    expect(snapshot?.url).toBe('https://github.com/ihabkhaled/ClawAI');
  });

  it('returns null when the response is not ok', async () => {
    mswServer.use(
      http.get(`${GITHUB_API_ORIGIN}/repos/:owner/:repository`, () =>
        HttpResponse.json({ message: 'Not Found' }, { status: 404 }),
      ),
    );

    vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(await fetchRepositorySnapshot('ihabkhaled', 'missing-repo')).toBeNull();
  });

  it('returns null when the payload does not match the schema', async () => {
    mswServer.use(
      http.get(`${GITHUB_API_ORIGIN}/repos/:owner/:repository`, () =>
        HttpResponse.json({ unexpected: 'shape' }),
      ),
    );

    vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(await fetchRepositorySnapshot('ihabkhaled', 'ClawAI')).toBeNull();
  });

  it('sends an Authorization header when a GitHub token is configured', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'ghp_example');
    resetServerEnvCache();
    let receivedAuthorization: string | null = null;
    mswServer.use(
      http.get(`${GITHUB_API_ORIGIN}/repos/:owner/:repository`, ({ request, params }) => {
        receivedAuthorization = request.headers.get('authorization');
        return HttpResponse.json({
          name: params['repository'],
          html_url: `https://github.com/ihabkhaled/${String(params['repository'])}`,
        });
      }),
    );

    await fetchRepositorySnapshot('ihabkhaled', 'ClawAI');

    expect(receivedAuthorization).toBe('Bearer ghp_example');
  });

  it('omits the Authorization header when no GitHub token is configured', async () => {
    let receivedAuthorization: string | null = 'not-yet-read';
    mswServer.use(
      http.get(`${GITHUB_API_ORIGIN}/repos/:owner/:repository`, ({ request, params }) => {
        receivedAuthorization = request.headers.get('authorization');
        return HttpResponse.json({
          name: params['repository'],
          html_url: `https://github.com/ihabkhaled/${String(params['repository'])}`,
        });
      }),
    );

    await fetchRepositorySnapshot('ihabkhaled', 'ClawAI');

    expect(receivedAuthorization).toBeNull();
  });

  it('returns null when the request fails outright', async () => {
    mswServer.use(
      http.get(`${GITHUB_API_ORIGIN}/repos/:owner/:repository`, () => HttpResponse.error()),
    );

    vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(await fetchRepositorySnapshot('ihabkhaled', 'ClawAI')).toBeNull();
  });

  it('skips the network call entirely when apiMocking is enabled', async () => {
    vi.stubEnv('SERVER_API_MOCKING', 'enabled');
    resetServerEnvCache();
    let requestReceived = false;
    mswServer.use(
      http.get(`${GITHUB_API_ORIGIN}/repos/:owner/:repository`, () => {
        requestReceived = true;
        return HttpResponse.json({
          name: 'ClawAI',
          html_url: 'https://github.com/ihabkhaled/ClawAI',
        });
      }),
    );

    expect(await fetchRepositorySnapshot('ihabkhaled', 'ClawAI')).toBeNull();
    expect(requestReceived).toBe(false);
  });
});
