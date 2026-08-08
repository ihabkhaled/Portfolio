import type { HTMLAttributes, ReactElement } from 'react';

import { alertVariants, type AlertVariantProperties } from './alert.variants';
import { cn } from './cn';

export interface AlertProperties extends HTMLAttributes<HTMLDivElement>, AlertVariantProperties {}

export function Alert(properties: Readonly<AlertProperties>): ReactElement {
  const { className, tone, ...rest } = properties;

  return <div role="status" className={cn(alertVariants({ tone }), className)} {...rest} />;
}
