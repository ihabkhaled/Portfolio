import { getBrowserLocationSuffix } from '@/packages/browser';
import { getLocaleDirection, isSupportedLocale } from '@/packages/i18n';
import { useAppNavigation } from '@/packages/navigation';
import { buildLocalizedLocation } from '@/shared/helpers/localized-route.helper';

import { THEME_ICONS } from '../constants/shell-controls.constants';
import { buildThemeActionLabel, getNextTheme } from '../helpers/next-theme.helper';
import { useUiPreferencesStore } from '../store/ui-preferences.store';
import type {
  ShellControlsContainerProperties,
  ShellControlsViewModel,
} from '../types/shell-controls.types';

export function useShellControls(
  properties: ShellControlsContainerProperties,
): ShellControlsViewModel {
  const navigation = useAppNavigation();
  const theme = useUiPreferencesStore((state) => state.theme);
  const setTheme = useUiPreferencesStore((state) => state.setTheme);
  const setDirection = useUiPreferencesStore((state) => state.setDirection);
  const nextTheme = getNextTheme(theme);

  return {
    themeIcon: THEME_ICONS[theme],
    themeActionLabel: buildThemeActionLabel(
      properties.themeLabel,
      properties.themeLabels[theme],
      properties.themeLabels[nextTheme],
    ),
    onLocaleChange: (event) => {
      const requestedLocale = event.currentTarget.value;
      if (!isSupportedLocale(requestedLocale)) {
        return;
      }
      setDirection(getLocaleDirection(requestedLocale));
      navigation.replace(
        buildLocalizedLocation(navigation.pathname, requestedLocale, getBrowserLocationSuffix()),
      );
    },
    onThemeChange: () => {
      setTheme(nextTheme);
    },
  };
}
