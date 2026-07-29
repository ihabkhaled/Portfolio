import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MouseEvent, ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import { SiteNavigationContainer } from '@/modules/site-navigation';
import { ShellControlsContainer, useUiPreferencesStore } from '@/modules/ui-preferences';
import { useAppNavigation } from '@/packages/navigation';
import { AppDirection } from '@/shared/enums/app-direction.enum';
import { AppTheme } from '@/shared/enums/app-theme.enum';
import { AppRouterStubProvider, buildRouterStub } from '@/tests/helpers/app-router-stub';

const labels = {
  home: 'Home',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  about: 'About',
  resume: 'Resume',
  contact: 'Contact',
} as const;
const MOBILE_MENU_TEST_ID = 'mobile-navigation-test';

function preventTestNavigation(event: MouseEvent<HTMLElement>): void {
  event.preventDefault();
}

describe('site navigation', () => {
  beforeEach(() => {
    useUiPreferencesStore.setState({ theme: AppTheme.Light, direction: AppDirection.Ltr });
  });

  it('marks the current localized route semantically', () => {
    const router = buildRouterStub();
    const wrapper = ({ children }: Readonly<{ children: ReactNode }>) => (
      <AppRouterStubProvider router={router} pathname="/en/projects">
        {children}
      </AppRouterStubProvider>
    );
    const view = renderHook(() => useAppNavigation(), { wrapper });
    expect(view.result.current.pathname).toBe('/en/projects');
    render(
      <AppRouterStubProvider router={router} pathname="/en/projects">
        <SiteNavigationContainer locale="en" labels={labels} scope="primary" />
      </AppRouterStubProvider>,
    );

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  });

  it('marks a nested case-study route as current on its parent Projects link', () => {
    render(
      <AppRouterStubProvider router={buildRouterStub()} pathname="/en/projects/clawai">
        <SiteNavigationContainer locale="en" labels={labels} scope="primary" />
      </AppRouterStubProvider>,
    );

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  });

  it('closes an open mobile navigation menu after selecting a route', async () => {
    const user = userEvent.setup();
    render(
      <AppRouterStubProvider router={buildRouterStub()} pathname="/en">
        <details open data-testid={MOBILE_MENU_TEST_ID} onClickCapture={preventTestNavigation}>
          <summary>Menu</summary>
          <SiteNavigationContainer locale="en" labels={labels} scope="all" />
        </details>
      </AppRouterStubProvider>,
    );
    const menu = screen.getByTestId(MOBILE_MENU_TEST_ID);

    expect(menu).toHaveAttribute('open');
    await user.click(screen.getByRole('link', { name: 'About' }));

    expect(menu).not.toHaveAttribute('open');
  });

  it('switches locale and advances the compact theme control', async () => {
    const user = userEvent.setup();
    const router = buildRouterStub();
    render(
      <AppRouterStubProvider router={router} pathname="/en/projects">
        <ShellControlsContainer
          locale="en"
          localeLabel="Change language"
          themeLabel="Change color theme"
          themeLabels={{ light: 'Light', dark: 'Dark', system: 'System' }}
        />
      </AppRouterStubProvider>,
    );

    const themeButton = screen.getByRole('button', { name: /Light.*Dark/u });
    const localeSelect = screen.getByRole('combobox', { name: 'Change language' });

    expect(themeButton).toBeInTheDocument();
    await user.selectOptions(localeSelect, 'ar');
    expect(router.replace).toHaveBeenCalledWith('/ar/projects');
    expect(useUiPreferencesStore.getState().direction).toBe(AppDirection.Rtl);
    await user.click(themeButton);
    expect(useUiPreferencesStore.getState().theme).toBe(AppTheme.Dark);
  });

  it('renders only the footer scope of navigation items', () => {
    render(
      <AppRouterStubProvider router={buildRouterStub()} pathname="/en">
        <SiteNavigationContainer locale="en" labels={labels} scope="footer" />
      </AppRouterStubProvider>,
    );

    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
  });
});
