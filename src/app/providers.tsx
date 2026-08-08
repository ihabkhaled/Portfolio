'use client';
// client-boundary-reason: composes the client-side providers (query cache) and mounts UI-preference DOM effects.

import type { ReactElement, ReactNode } from 'react';

import { UiPreferencesEffects } from '@/modules/ui-preferences';
import { AppQueryProvider } from '@/packages/query';

export function AppProviders(properties: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <AppQueryProvider>
      <UiPreferencesEffects />
      {properties.children}
    </AppQueryProvider>
  );
}
