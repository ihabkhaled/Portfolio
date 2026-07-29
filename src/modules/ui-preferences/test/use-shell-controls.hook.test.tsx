import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppDirection } from '@/shared/enums/app-direction.enum';
import { AppTheme } from '@/shared/enums/app-theme.enum';
import { AppRouterStubProvider, buildRouterStub } from '@/tests/helpers/app-router-stub';

import { useShellControls } from '../hooks/use-shell-controls.hook';
import { useUiPreferencesStore } from '../store/ui-preferences.store';

beforeEach(() => {
  useUiPreferencesStore.setState({ theme: AppTheme.Light, direction: AppDirection.Ltr });
});

describe('useShellControls', () => {
  it('ignores a locale change to an unsupported value', () => {
    const router = buildRouterStub();
    const wrapper = ({ children }: Readonly<{ children: ReactNode }>) => (
      <AppRouterStubProvider router={router} pathname="/en/projects">
        {children}
      </AppRouterStubProvider>
    );
    const { result } = renderHook(
      () =>
        useShellControls({
          locale: 'en',
          localeLabel: 'Change language',
          themeLabel: 'Change color theme',
          themeLabels: { light: 'Light', dark: 'Dark', system: 'System' },
        }),
      { wrapper },
    );

    act(() => {
      result.current.onLocaleChange({
        currentTarget: { value: 'not-a-real-locale' },
      } as unknown as ChangeEvent<HTMLSelectElement>);
    });

    expect(router.replace).not.toHaveBeenCalled();
    expect(useUiPreferencesStore.getState().direction).toBe(AppDirection.Ltr);
  });
});
