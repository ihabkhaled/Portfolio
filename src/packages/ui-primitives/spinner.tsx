import type { ReactElement } from 'react';

import { cn } from './cn';

export interface SpinnerProperties {
  readonly label: string;
  readonly className?: string;
}

export function Spinner(properties: SpinnerProperties): ReactElement {
  return (
    <span
      role="status"
      aria-label={properties.label}
      className={cn('inline-flex', properties.className)}
    >
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-border border-t-primary"
      />
    </span>
  );
}
