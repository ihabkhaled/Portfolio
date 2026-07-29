import 'server-only';

import { GITHUB_OWNER } from '../constants/github.constants';
import { fetchRepositorySnapshot } from '../gateway/github.gateway';
import type { RepositoryActivityReport, RepositorySnapshot } from '../types/github.types';

/**
 * Fetches the curated repositories concurrently and reports whether any of
 * them fell back to static content.
 *
 * The returned map is keyed by repository name so the projects module can look
 * up live metadata without caring how it was obtained. Requests run in
 * parallel and each one fails independently: one dead repository never blanks
 * the whole panel.
 */
export async function buildRepositoryActivityReport(
  repositoryNames: readonly string[],
): Promise<RepositoryActivityReport> {
  const results = await Promise.all(
    repositoryNames.map((name) => fetchRepositorySnapshot(GITHUB_OWNER, name)),
  );

  const repositories = results.filter(
    (snapshot): snapshot is RepositorySnapshot => snapshot !== null,
  );

  return {
    repositories,
    degraded: repositories.length !== repositoryNames.length,
  };
}

/** Index snapshots by repository name for O(1) lookup from the view layer. */
export function indexSnapshotsByName(
  snapshots: readonly RepositorySnapshot[],
): ReadonlyMap<string, RepositorySnapshot> {
  return new Map(snapshots.map((snapshot) => [snapshot.name, snapshot]));
}
