import {
  toLicense,
  toNullableText,
  toPositiveCount,
  toVerifiedHomepage,
} from '../helpers/github-normalize.helper';
import type { GithubRepoPayload } from '../schemas/github.schema';
import type { RepoSnapshot } from '../types/github.types';

export function mapRepoPayload(payload: GithubRepoPayload): RepoSnapshot {
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
