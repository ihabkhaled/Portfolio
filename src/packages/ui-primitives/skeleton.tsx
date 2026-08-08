import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type SkeletonProperties = HTMLAttributes<HTMLDivElement>;

export function Skeleton(properties: Readonly<SkeletonProperties>): ReactElement {
  const { className, ...rest } = properties;

  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...rest}
    />
  );
}
