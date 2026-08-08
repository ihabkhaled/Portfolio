import type { ReactElement } from 'react';

import { Alert } from '@/packages/ui-primitives';

import type { EmptyStateProperties } from '../types/shared-component.types';

export function EmptyState(properties: EmptyStateProperties): ReactElement {
  return (
    <Alert tone="info" data-testid={properties.testId}>
      {properties.message}
    </Alert>
  );
}
