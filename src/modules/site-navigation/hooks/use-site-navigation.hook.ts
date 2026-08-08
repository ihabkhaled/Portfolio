import { useAppNavigation } from '@/packages/navigation';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';

import { SITE_NAVIGATION_ITEMS } from '../constants/site-navigation.constants';
import { isCurrentPath } from '../helpers/site-navigation-path.helper';
import type {
  SiteNavigationProperties,
  SiteNavigationViewModel,
} from '../types/site-navigation.types';

export function useSiteNavigation(properties: SiteNavigationProperties): SiteNavigationViewModel {
  const { pathname } = useAppNavigation();
  const homeHref = buildLocalizedPath(properties.locale, '/');

  return {
    items: SITE_NAVIGATION_ITEMS.filter((item) => item.scopes.includes(properties.scope)).map(
      (item) => {
        const href = buildLocalizedPath(properties.locale, item.path);
        return {
          href,
          label: properties.labels[item.labelKey],
          isCurrent: isCurrentPath(pathname, href, homeHref),
        };
      },
    ),
    onSelect: (event) => {
      // Closing the sheet on selection keeps focus predictable on mobile.
      event.currentTarget.closest('details')?.removeAttribute('open');
    },
  };
}
