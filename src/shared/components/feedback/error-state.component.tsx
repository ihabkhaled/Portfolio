import type { ReactElement } from 'react';

import { Alert, Button, Stack } from '@/packages/ui-primitives';

import type { ErrorStateProperties } from '../types/shared-component.types';

export function ErrorState(properties: ErrorStateProperties): ReactElement {
  return (
    <Stack gap="sm" data-testid={properties.testId}>
      <Alert tone="danger">{properties.message}</Alert>
      <Stack direction="row" justify="start">
        <Button variant="secondary" onClick={properties.onRetry}>
          {properties.retryLabel}
        </Button>
      </Stack>
    </Stack>
  );
}
