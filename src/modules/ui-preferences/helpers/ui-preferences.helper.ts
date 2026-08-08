import { isMediaQueryMatched } from '@/packages/browser';
import { AppTheme, type AppThemeValue } from '@/shared/enums/app-theme.enum';

import { DARK_COLOR_SCHEME_QUERY } from '../constants/ui-preferences.constants';

/**
Resolves the `system` theme to the concrete attribute the DOM needs.
*/
export function resolveThemeAttribute(theme: AppThemeValue): string {
  if (theme === AppTheme.System) {
    return isMediaQueryMatched(DARK_COLOR_SCHEME_QUERY) ? AppTheme.Dark : AppTheme.Light;
  }

  return theme;
}
