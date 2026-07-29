import { isSafeExternalUrl } from '@/shared/security/external-url.helper';

import type { GithubRepositoryPayload } from '../schemas/github.schema';
import type { RepositorySnapshot } from '../types/github.types';

/** Blank strings are treated as absent so the view never renders empty rows. */
function toNullableText(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * Zero is indistinguishable from "no signal" for a portfolio, so counts only
 * survive when positive. This is what keeps `0 stars` off the page.
 */
function toPositiveCount(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return value > 0 ? value : null;
}

/** A homepage is only shown when it is a safe, absolute https URL. */
function toVerifiedHomepage(value: string | null | undefined): string | null {
  const candidate = toNullableText(value);
  if (candidate === null) return null;
  return isSafeExternalUrl(candidate) ? candidate : null;
}

/** GitHub uses NOASSERTION for licenses it could not identify. */
function toLicense(value: string | null | undefined): string | null {
  const candidate = toNullableText(value);
  if (candidate === null || candidate === 'NOASSERTION') return null;
  return candidate;
}

export function mapRepositoryPayload(payload: GithubRepositoryPayload): RepositorySnapshot {
  return {
    name: payload.name,
    description: toNullableText(payload.description),
    url: payload.html_url,
    homepage: toVerifiedHomepage(payload.homepage),
    topics: payload.topics ?? [],
    primaryLanguage: toNullableText(payload.language),
    stars: toPositiveCount(payload.stargazers_count),
    forks: toPositiveCount(payload.forks_count),
    license: toLicense(payload.license?.spdx_id),
    lastActivityAt: toNullableText(payload.pushed_at) ?? toNullableText(payload.updated_at),
  };
}
