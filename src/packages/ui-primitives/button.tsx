import type { ButtonHTMLAttributes, ReactElement } from 'react';

import { buttonVariants, type ButtonVariantProperties } from './button.variants';
import { cn } from './cn';

export interface ButtonProperties
  extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProperties {}

export function Button(properties: Readonly<ButtonProperties>): ReactElement {
  const { className, variant, size, type, ...rest } = properties;

  return (
    <button
      type={type ?? 'button'}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    />
  );
}
