import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';

import type { SiteNavigationLabelKey, SiteNavigationScope } from '../types/site-navigation.types';

export interface SiteNavigationItemConfig {
  readonly path: (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
  readonly labelKey: SiteNavigationLabelKey;
  readonly scopes: readonly SiteNavigationScope[];
}

/**
 * One navigation catalog for every surface. Slugs are locale-independent;
 * only the labels are translated.
 */
export const SITE_NAVIGATION_ITEMS: readonly SiteNavigationItemConfig[] = [
  { path: ROUTE_PATHS.home, labelKey: 'home', scopes: ['primary', 'all'] },
  {
    path: ROUTE_PATHS.experience,
    labelKey: 'experience',
    scopes: ['primary', 'all', 'footer'],
  },
  { path: ROUTE_PATHS.projects, labelKey: 'projects', scopes: ['primary', 'all', 'footer'] },
  { path: ROUTE_PATHS.skills, labelKey: 'skills', scopes: ['primary', 'all', 'footer'] },
  { path: ROUTE_PATHS.about, labelKey: 'about', scopes: ['primary', 'all', 'footer'] },
  { path: ROUTE_PATHS.resume, labelKey: 'resume', scopes: ['primary', 'all', 'footer'] },
  { path: ROUTE_PATHS.contact, labelKey: 'contact', scopes: ['primary', 'all', 'footer'] },
];
