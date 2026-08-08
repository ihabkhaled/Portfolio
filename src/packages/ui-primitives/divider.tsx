import type { HTMLAttributes, ReactElement } from 'react';

import { cn } from './cn';

export type DividerProperties = HTMLAttributes<HTMLHRElement>;

export function Divider(properties: Readonly<DividerProperties>): ReactElement {
  const { className, ...rest } = properties;

  return <hr className={cn('w-full border-0 border-t border-border', className)} {...rest} />;
}
