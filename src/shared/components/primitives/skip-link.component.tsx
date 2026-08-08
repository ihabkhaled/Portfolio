import type { ReactElement } from 'react';

import type { SkipLinkProperties } from '../types/shared-component.types';

/**
 * Keyboard users jump straight to the main landmark. Visually hidden until
 * focused. Lives in primitives/ because it owns raw positioning classes.
 */
export function SkipLink(properties: SkipLinkProperties): ReactElement {
  return (
    <a
      href={properties.targetHref}
      className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
    >
      {properties.label}
    </a>
  );
}
