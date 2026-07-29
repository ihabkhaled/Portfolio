import type { AppDirectionValue } from '@/shared/enums/app-direction.enum';
import type { AppThemeValue } from '@/shared/enums/app-theme.enum';

export interface UiPreferencesSnapshot {
  readonly theme: AppThemeValue;
  readonly direction: AppDirectionValue;
  readonly isSidebarExpanded: boolean;
}

export interface UiPreferencesState extends UiPreferencesSnapshot {
  readonly hasHydrated: boolean;
  readonly setTheme: (theme: AppThemeValue) => void;
  readonly setDirection: (direction: AppDirectionValue) => void;
  readonly toggleSidebar: () => void;
  readonly hydrate: (snapshot: UiPreferencesSnapshot) => void;
}
