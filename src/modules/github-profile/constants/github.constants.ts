/** Public GitHub REST base. Only unauthenticated-safe endpoints are used. */
export const GITHUB_API_ORIGIN = 'https://api.github.com';

/** Cache window for repository metadata. Pages are static between revalidations. */
export const GITHUB_REVALIDATE_SECONDS = 3600;

/** A slow third party must never hold a page render open. */
export const GITHUB_REQUEST_TIMEOUT_MS = 4000;

export const GITHUB_ACCEPT_HEADER = 'application/vnd.github+json';
export const GITHUB_API_VERSION_HEADER = '2022-11-28';
