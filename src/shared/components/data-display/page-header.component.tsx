import type { ReactElement } from 'react';

import { Stack } from '@/packages/ui-primitives';

import type { PageHeaderProperties } from '../types/shared-component.types';

import { pageHeaderClasses } from './page-header.variants';

export function PageHeader(properties: PageHeaderProperties): ReactElement {
  return (
    <Stack gap="xs">
      <h1 className={pageHeaderClasses.title}>{properties.title}</h1>
      {properties.subtitle ? (
        <p className={pageHeaderClasses.subtitle}>{properties.subtitle}</p>
      ) : null}
    </Stack>
  );
}
