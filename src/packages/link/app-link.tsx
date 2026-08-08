import type { Route } from 'next';
import NextLink from 'next/link';
import type { MouseEventHandler, ReactElement, ReactNode } from 'react';

/**
 * Deliberately narrow prop surface: navigation styling and identification
 * only. Interactive behavior belongs in containers, not links.
 */
export interface AppLinkProperties {
  readonly href: Route;
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly prefetch?: boolean;
  readonly 'aria-label'?: string;
  readonly 'aria-current'?: 'page' | undefined;
  readonly 'data-testid'?: string;
  readonly onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/**
Internal navigation. Typed routes keep dead links out of the build.
*/
export function AppLink(properties: AppLinkProperties): ReactElement {
  const optionalClickProperties =
    properties.onClick === undefined ? {} : { onClick: properties.onClick };

  return (
    <NextLink
      href={properties.href}
      prefetch={properties.prefetch ?? true}
      className={properties.className}
      aria-label={properties['aria-label']}
      aria-current={properties['aria-current']}
      data-testid={properties['data-testid']}
      {...optionalClickProperties}
    >
      {properties.children}
    </NextLink>
  );
}

export interface ExternalLinkProperties {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly 'aria-label'?: string;
  readonly 'data-testid'?: string;
}

/**
External links always open safely (noopener/noreferrer, new tab).
*/
export function ExternalLink(properties: ExternalLinkProperties): ReactElement {
  return (
    <a
      href={properties.href}
      target="_blank"
      rel="noopener noreferrer"
      className={properties.className}
      aria-label={properties['aria-label']}
      data-testid={properties['data-testid']}
    >
      {properties.children}
    </a>
  );
}
