import type { RepoSnapshot } from '@/modules/github-profile';

/**
 * Builds the small set of metadata strings shown under a project's stack —
 * language, star count, licence — omitting anything the snapshot lacks. A
 * translator function resolves the pluralized star-count message.
 */
export function buildRepoMetricLabels(
  snapshot: RepoSnapshot | undefined,
  translateStars: (count: number) => string,
): readonly string[] {
  return [
    snapshot?.primaryLanguage ?? null,
    snapshot?.stars === undefined || snapshot.stars === null
      ? null
      : translateStars(snapshot.stars),
    snapshot?.license ?? null,
  ].filter((entry): entry is string => entry !== null);
}
