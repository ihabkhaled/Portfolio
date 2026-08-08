import type { ReactElement } from 'react';

import type { VisuallyHiddenProperties } from '../types/shared-component.types';

/**
Screen-reader-only content.
*/
export function VisuallyHidden(properties: VisuallyHiddenProperties): ReactElement {
  return <span className="sr-only">{properties.children}</span>;
}
