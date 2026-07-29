'use client';
// client-boundary-reason: reads the active pathname to mark the current route.

import type { ReactElement } from 'react';

import { AppLink } from '@/packages/link';
import { cn } from '@/packages/ui-primitives';
import { siteShellClasses } from '@/shared/components/layout/site-shell.variants';

import { useSiteNavigation } from '../hooks/use-site-navigation.hook';
import type { SiteNavigationProps } from '../types/site-navigation.types';

export function SiteNavigationContainer(props: SiteNavigationProps): ReactElement {
  const navigation = useSiteNavigation(props);

  return (
    <>
      {navigation.items.map((item) => (
        <AppLink
          key={item.href}
          href={item.href}
          className={cn(
            siteShellClasses.navLink,
            item.isCurrent && siteShellClasses.navLinkCurrent,
          )}
          aria-current={item.isCurrent ? 'page' : undefined}
          onClick={navigation.onSelect}
        >
          {item.label}
        </AppLink>
      ))}
    </>
  );
}
