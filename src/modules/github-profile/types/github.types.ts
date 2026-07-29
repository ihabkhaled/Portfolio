/** Normalized, presentation-ready repository metadata. */
export interface RepositorySnapshot {
  readonly name: string;
  readonly description: string | null;
  readonly url: string;
  /** Only present when the homepage is a syntactically valid https URL. */
  readonly homepage: string | null;
  readonly topics: readonly string[];
  readonly primaryLanguage: string | null;
  /** Null rather than 0 so the view never renders a meaningless metric. */
  readonly stars: number | null;
  readonly forks: number | null;
  readonly license: string | null;
  readonly lastActivityAt: string | null;
}

/**
 * The result of asking GitHub for the curated set. `degraded` means the API
 * did not answer and the values came from the static catalog instead — the
 * portfolio renders identically either way.
 */
export interface RepositoryActivityReport {
  readonly repositories: readonly RepositorySnapshot[];
  readonly degraded: boolean;
}
