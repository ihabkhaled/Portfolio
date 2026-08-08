import type { Route } from 'next';
import type { MouseEventHandler } from 'react';

import type { AppLocale } from '@/packages/i18n';

/**
`primary` is the header, `footer` the reduced set, `all` the mobile sheet.
*/
export type SiteNavigationScope = 'primary' | 'footer' | 'all';

export type SiteNavigationLabelKey =
  'home' | 'experience' | 'projects' | 'skills' | 'about' | 'resume' | 'contact';

export type SiteNavigationLabels = Readonly<Record<SiteNavigationLabelKey, string>>;

export interface SiteNavigationProperties {
  readonly locale: AppLocale;
  readonly labels: SiteNavigationLabels;
  readonly scope: SiteNavigationScope;
}

export interface SiteNavigationItemViewModel {
  readonly href: Route;
  readonly label: string;
  readonly isCurrent: boolean;
}

export interface SiteNavigationViewModel {
  readonly items: readonly SiteNavigationItemViewModel[];
  readonly onSelect: MouseEventHandler<HTMLAnchorElement>;
}
