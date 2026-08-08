import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type CardProperties = HTMLAttributes<HTMLDivElement>;

export function Card(properties: Readonly<CardProperties>): ReactElement {
  const { className, ...rest } = properties;

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface-raised p-6 transition-[border-color,background-color]',
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader(properties: Readonly<HTMLAttributes<HTMLDivElement>>): ReactElement {
  const { className, ...rest } = properties;

  return <div className={cn('flex flex-col gap-1.5', className)} {...rest} />;
}

export function CardTitle(properties: Readonly<HTMLAttributes<HTMLHeadingElement>>): ReactElement {
  const { className, children, ...rest } = properties;

  return (
    <h2 className={cn('text-lg font-bold tracking-tight text-foreground', className)} {...rest}>
      {children}
    </h2>
  );
}

export function CardDescription(
  properties: Readonly<HTMLAttributes<HTMLParagraphElement>>,
): ReactElement {
  const { className, ...rest } = properties;

  return <p className={cn('text-sm text-muted-foreground', className)} {...rest} />;
}

export function CardContent(properties: Readonly<HTMLAttributes<HTMLDivElement>>): ReactElement {
  const { className, ...rest } = properties;

  return <div className={cn('pt-5', className)} {...rest} />;
}

export function CardFooter(properties: Readonly<HTMLAttributes<HTMLDivElement>>): ReactElement {
  const { className, ...rest } = properties;

  return <div className={cn('flex items-center gap-3 pt-5', className)} {...rest} />;
}
