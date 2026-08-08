import type { LabelHTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type LabelProperties = LabelHTMLAttributes<HTMLLabelElement>;

export function Label(properties: Readonly<LabelProperties>): ReactElement {
  const { className, children, ...rest } = properties;

  return (
    <label className={cn('text-sm font-medium text-foreground', className)} {...rest}>
      {children}
    </label>
  );
}
