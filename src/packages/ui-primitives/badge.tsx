import type { HTMLAttributes, ReactElement } from 'react';

import { badgeVariants, type BadgeVariantProperties } from './badge.variants';
import { cn } from './cn';

export interface BadgeProperties extends HTMLAttributes<HTMLSpanElement>, BadgeVariantProperties {}

export function Badge(properties: Readonly<BadgeProperties>): ReactElement {
  const { className, tone, ...rest } = properties;

  return <span className={cn(badgeVariants({ tone }), className)} {...rest} />;
}
