import NextImage, { type ImageProps as NextImageProperties } from 'next/image';
import type { ReactElement } from 'react';

export interface AppImageProperties extends Omit<NextImageProperties, 'alt'> {
  /**
  Alt text is mandatory; pass an empty string only for purely decorative images.
  */
  readonly alt: string;
}

/**
Optimized image rendering. Remote hosts must be allowlisted in next.config.ts.
*/
export function AppImage(properties: Readonly<AppImageProperties>): ReactElement {
  return <NextImage {...properties} />;
}
