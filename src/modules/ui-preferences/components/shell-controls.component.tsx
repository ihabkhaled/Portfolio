import type { ReactElement } from 'react';

import { Button, Select } from '@/packages/ui-primitives';
import { siteShellClasses } from '@/shared/components/layout/site-shell.variants';

import type { ShellControlsProperties } from '../types/shell-controls.types';

export function ShellControls(properties: ShellControlsProperties): ReactElement {
  return (
    <>
      <Select
        className={siteShellClasses.localeSelect}
        value={properties.locale}
        aria-label={properties.localeLabel}
        onChange={properties.onLocaleChange}
      >
        {properties.localeOptions}
      </Select>
      <Button
        className={siteShellClasses.themeButton}
        variant="secondary"
        size="sm"
        aria-label={properties.themeActionLabel}
        title={properties.themeActionLabel}
        onClick={properties.onThemeChange}
      >
        {properties.themeIcon}
      </Button>
    </>
  );
}
