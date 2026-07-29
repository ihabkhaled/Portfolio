import { useAppNavigation } from '@/packages/navigation';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';

import { SITE_NAVIGATION_ITEMS } from '../constants/site-navigation.constants';
import type { SiteNavigationProps, SiteNavigationViewModel } from '../types/site-navigation.types';

/**
 * A nested route such as /projects/clawai still marks "Projects" as current,
 * so the header never loses its place on a case-study page.
 */
function isCurrentPath(pathname: string, href: string, homeHref: string): boolean {
  if (href === homeHref) return pathname === homeHref;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function useSiteNavigation(props: SiteNavigationProps): SiteNavigationViewModel {
  const { pathname } = useAppNavigation();
  const homeHref = buildLocalizedPath(props.locale, '/');

  return {
    items: SITE_NAVIGATION_ITEMS.filter((item) => item.scopes.includes(props.scope)).map((item) => {
      const href = buildLocalizedPath(props.locale, item.path);
      return {
        href,
        label: props.labels[item.labelKey],
        isCurrent: isCurrentPath(pathname, href, homeHref),
      };
    }),
    onSelect: (event) => {
      // Closing the sheet on selection keeps focus predictable on mobile.
      event.currentTarget.closest('details')?.removeAttribute('open');
    },
  };
}
