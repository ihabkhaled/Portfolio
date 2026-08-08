import { ROUTE_PATHS } from './route-paths.constants';

/**
Every public page is indexable; the portfolio has nothing to hide.
*/
export const INDEXABLE_PATHS = [
  ROUTE_PATHS.home,
  ROUTE_PATHS.experience,
  ROUTE_PATHS.projects,
  ROUTE_PATHS.skills,
  ROUTE_PATHS.about,
  ROUTE_PATHS.resume,
  ROUTE_PATHS.contact,
] as const;

/**
The offline shell is a PWA fallback, not a destination.
*/
export const NON_INDEXABLE_PATHS = [ROUTE_PATHS.offline] as const;

export const SOCIAL_IMAGE_DIRECTORY = '/social' as const;

export const SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;
