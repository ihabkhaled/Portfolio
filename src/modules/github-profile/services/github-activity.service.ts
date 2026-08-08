import 'server-only';

import { GITHUB_OWNER } from '../constants/github.constants';
import { fetchRepoSnapshot } from '../gateway/github.gateway';
import type { RepoActivityReport, RepoSnapshot } from '../types/github.types';

/**
 * Fetches the curated repositories concurrently and reports whether any of
 * them fell back to static content.
 *
 * The returned map is keyed by repository name so the projects module can look
 * up live metadata without caring how it was obtained. Requests run in
 * parallel and each one fails independently: one dead repository never blanks
 * the whole panel.
 */
export async function buildRepoActivityReport(
  repoNames: readonly string[],
): Promise<RepoActivityReport> {
  const results = await Promise.all(repoNames.map((name) => fetchRepoSnapshot(GITHUB_OWNER, name)));

  const repositories = results.filter((snapshot): snapshot is RepoSnapshot => snapshot !== null);

  return {
    repositories,
    degraded: repositories.length !== repoNames.length,
  };
}

/**
Index snapshots by repository name for O(1) lookup from the view layer.
*/
export function indexSnapshotsByName(
  snapshots: readonly RepoSnapshot[],
): ReadonlyMap<string, RepoSnapshot> {
  return new Map(snapshots.map((snapshot) => [snapshot.name, snapshot]));
}
