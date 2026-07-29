import type { Route } from 'next';

/**
 * Every internal route path lives here. Raw path strings in app code are a
 * no-magic-strings violation; typed Route keeps dead links out of the build.
 * Slugs stay stable across locales — only navigation labels are translated.
 */
export const ROUTE_PATHS = {
  home: '/' as Route,
  experience: '/experience' as Route,
  projects: '/projects' as Route,
  skills: '/skills' as Route,
  about: '/about' as Route,
  resume: '/resume' as Route,
  contact: '/contact' as Route,
  offline: '/offline' as Route,
} as const;

/** Catalog-derived public API. @public */
export type AppRoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

/** Canonical path for a single project case study. */
export function buildProjectPath(slug: string): Route {
  return `${ROUTE_PATHS.projects}/${slug}` as Route;
}
