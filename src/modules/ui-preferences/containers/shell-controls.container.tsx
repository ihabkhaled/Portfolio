'use client';
// client-boundary-reason: binds localized URL navigation and preference state to shell controls.

import type { ReactElement } from 'react';

import { LOCALE_NAMES, SUPPORTED_LOCALES } from '@/packages/i18n';

import { ShellControls } from '../components/shell-controls.component';
import { useShellControls } from '../hooks/use-shell-controls.hook';
import type { ShellControlsContainerProperties } from '../types/shell-controls.types';

export function ShellControlsContainer(properties: ShellControlsContainerProperties): ReactElement {
  const controls = useShellControls(properties);
  const localeOptions = SUPPORTED_LOCALES.map((locale) => (
    <option key={locale} value={locale}>
      {LOCALE_NAMES[locale]}
    </option>
  ));
  return (
    <ShellControls
      locale={properties.locale}
      localeLabel={properties.localeLabel}
      localeOptions={localeOptions}
      {...controls}
    />
  );
}
