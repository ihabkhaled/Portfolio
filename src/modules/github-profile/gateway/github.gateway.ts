import 'server-only';

import { getServerEnv } from '@/packages/env/server';
import { appLogger } from '@/packages/logger';

import {
  GITHUB_ACCEPT_HEADER,
  GITHUB_API_ORIGIN,
  GITHUB_API_VERSION_HEADER,
  GITHUB_REQUEST_TIMEOUT_MS,
  GITHUB_REVALIDATE_SECONDS,
} from '../constants/github.constants';
import { mapRepositoryPayload } from '../mappers/github.mapper';
import { githubRepositorySchema } from '../schemas/github.schema';
import type { RepositorySnapshot } from '../types/github.types';

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
 */
export async function fetchRepositorySnapshot(
  owner: string,
  repository: string,
): Promise<RepositorySnapshot | null> {
  const { githubToken } = getServerEnv();

  try {
    const response = await fetch(`${GITHUB_API_ORIGIN}/repos/${owner}/${repository}`, {
      headers: buildHeaders(githubToken),
      signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
      next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      appLogger.warn('github repository request rejected', {
        repository,
        status: response.status,
      });
      return null;
    }

    const parsed = githubRepositorySchema.safeParse(await response.json());
    if (!parsed.success) {
      appLogger.warn('github repository payload did not match the schema', { repository });
      return null;
    }

    return mapRepositoryPayload(parsed.data);
  } catch {
    // Deliberately swallowed: the static catalog is the contract with the page.
    appLogger.warn('github repository request failed', { repository });
    return null;
  }
}
