import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppDirection } from '@/shared/enums/app-direction.enum';
import { AppTheme } from '@/shared/enums/app-theme.enum';

import { UI_PREFERENCES_DEFAULTS } from '../constants/ui-preferences.constants';
import { useUiPreferencesEffects } from '../hooks/use-ui-preferences-effects.hook';
import { useUiPreferencesStore } from '../store/ui-preferences.store';

const STORAGE_KEY = 'snr.ui-preferences.v1';

beforeEach(() => {
  useUiPreferencesStore.setState({ ...UI_PREFERENCES_DEFAULTS, hasHydrated: false });
  localStorage.clear();
  document.documentElement.removeAttribute('dir');
  delete document.documentElement.dataset['theme'];
});

describe('useUiPreferencesEffects', () => {
  it('hydrates from defaults and LTR when nothing is stored and the DOM has no dir attribute', () => {
    renderHook(() => {
      useUiPreferencesEffects();
    });

    const state = useUiPreferencesStore.getState();
    expect(state.hasHydrated).toBe(true);
    expect(state.direction).toBe(AppDirection.Ltr);
    expect(state.theme).toBe(UI_PREFERENCES_DEFAULTS.theme);
  });

  it('hydrates theme and sidebar from storage but lets the DOM own direction', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        theme: AppTheme.Dark,
        direction: AppDirection.Ltr,
        isSidebarExpanded: false,
      }),
    );
    document.documentElement.setAttribute('dir', 'rtl');

    renderHook(() => {
      useUiPreferencesEffects();
    });

    const state = useUiPreferencesStore.getState();
    expect(state.theme).toBe(AppTheme.Dark);
    expect(state.isSidebarExpanded).toBe(false);
    expect(state.direction).toBe(AppDirection.Rtl);
  });

  it('discards a malformed stored snapshot and falls back to current defaults', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: 'not-a-real-theme' }));

    renderHook(() => {
      useUiPreferencesEffects();
    });

    expect(useUiPreferencesStore.getState().theme).toBe(UI_PREFERENCES_DEFAULTS.theme);
  });

  it('mirrors theme and direction to the document root once hydrated', () => {
    renderHook(() => {
      useUiPreferencesEffects();
    });

    expect(document.documentElement.dataset['theme']).toBe(AppTheme.Light);
    expect(document.documentElement.getAttribute('dir')).toBe(AppDirection.Ltr);

    act(() => {
      useUiPreferencesStore.getState().setTheme(AppTheme.Dark);
      useUiPreferencesStore.getState().setDirection(AppDirection.Rtl);
    });

    expect(document.documentElement.dataset['theme']).toBe(AppTheme.Dark);
    expect(document.documentElement.getAttribute('dir')).toBe(AppDirection.Rtl);
  });

  it('persists the current snapshot to storage on every change once hydrated', () => {
    renderHook(() => {
      useUiPreferencesEffects();
    });

    act(() => {
      useUiPreferencesStore.getState().toggleSidebar();
    });

    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(stored).toEqual({
      theme: AppTheme.Light,
      direction: AppDirection.Ltr,
      isSidebarExpanded: false,
    });
  });
});
