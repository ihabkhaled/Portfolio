import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';
import { stackVariants, type StackVariantProperties } from './stack.variants';

export interface StackProperties extends HTMLAttributes<HTMLDivElement>, StackVariantProperties {}

/**
Flex layout primitive with logical-direction awareness (RTL-safe).
*/
export function Stack(properties: Readonly<StackProperties>): ReactElement {
  const { className, direction, gap, align, justify, wrap, ...rest } = properties;

  return (
    <div
      className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
      {...rest}
    />
  );
}
