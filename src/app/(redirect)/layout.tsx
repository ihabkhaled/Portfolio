import type { ReactElement, ReactNode } from 'react';

import { appFontClassName } from '@/shared/fonts/app-fonts';

import '../styles.css';

export default function RedirectRootLayout(
  properties: Readonly<{ children: ReactNode }>,
): ReactElement {
  return (
    <html lang="en" dir="ltr" data-theme="light" className={appFontClassName}>
      <body>{properties.children}</body>
    </html>
  );
}
