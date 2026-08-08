import 'server-only';

import { getServerEnvironment } from '@/packages/env/server';
import { appLogger } from '@/packages/logger';

import {
  GITHUB_ACCEPT_HEADER,
  GITHUB_API_ORIGIN,
  GITHUB_API_VERSION_HEADER,
  GITHUB_REQUEST_TIMEOUT_MS,
  GITHUB_REVALIDATE_SECONDS,
} from '../constants/github.constants';
import { mapRepoPayload } from '../mappers/github.mapper';
import { githubRepoSchema } from '../schemas/github.schema';
import type { RepoSnapshot } from '../types/github.types';

function buildHeaders(token: string | null): Record<string, string> {
  const baseHeaders: Record<string, string> = {
    Accept: GITHUB_ACCEPT_HEADER,
    'X-GitHub-Api-Version': GITHUB_API_VERSION_HEADER,
  };

  return token === null ? baseHeaders : { ...baseHeaders, Authorization: `Bearer ${token}` };
}

/**
 * Fetches one repository's public metadata.
 *
 * Returns null on any failure — network error, non-200, timeout, or a payload
 * that does not match the schema. Callers substitute static content, so GitHub
 * being slow, rate-limited or down can never break a page render.
 *
 * When `apiMocking` is enabled (only Playwright's webServer sets this), skips
 * the network call entirely and returns null unconditionally: real GitHub
 * responses are live, uncontrolled third-party data, and rendering off them
 * makes e2e/visual runs non-deterministic (the "recently active" badge and
 * page height shift with whatever GitHub happens to return, or whether it
 * rate-limited the request, at that exact moment).
 */
export async function fetchRepoSnapshot(owner: string, repo: string): Promise<RepoSnapshot | null> {
  const { githubToken, apiMocking } = getServerEnvironment();

  if (apiMocking === 'enabled') {
    return null;
  }

  try {
    const response = await fetch(`${GITHUB_API_ORIGIN}/repos/${owner}/${repo}`, {
      headers: buildHeaders(githubToken),
      signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
      next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      appLogger.warn('github repository request rejected', {
        repository: repo,
        status: response.status,
      });
      return null;
    }

    const parsed = githubRepoSchema.safeParse(await response.json());
    if (!parsed.success) {
      appLogger.warn('github repository payload did not match the schema', { repository: repo });
      return null;
    }

    return mapRepoPayload(parsed.data);
  } catch {
    // Deliberately swallowed: the static catalog is the contract with the page.
    appLogger.warn('github repository request failed', { repository: repo });
    return null;
  }
}
