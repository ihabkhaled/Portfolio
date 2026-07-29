import { appConfig } from '@/shared/config/app-config';

/**
 * Consistent browser-tab titles: "Section · App name". A section whose title is
 * already the app name (the home page) is not repeated back at the reader.
 */
export function buildPageTitle(sectionTitle: string): string {
  const trimmed = sectionTitle.trim();

  if (trimmed === '' || trimmed === appConfig.appName) {
    return appConfig.appName;
  }

  return `${trimmed} · ${appConfig.appName}`;
}
