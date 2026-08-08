import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { getServerTranslations, isSupportedLocale, setServerLocale } from '@/packages/i18n';
import { appNotFound } from '@/packages/navigation';
import { PageContainer, Stack } from '@/packages/ui-primitives';
import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { buildNonIndexableMetadata } from '@/shared/helpers/seo-metadata.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';
import type { LocaleRouteProperties } from '@/shared/types/app-route.types';

export async function generateMetadata(properties: LocaleRouteProperties): Promise<Metadata> {
  const { locale } = await properties.params;
  if (!isSupportedLocale(locale)) return {};
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.pwa });
  return buildNonIndexableMetadata(buildPageTitle(t('offlineTitle')));
}

export default async function OfflinePage(
  properties: LocaleRouteProperties,
): Promise<ReactElement> {
  const { locale } = await properties.params;
  if (!isSupportedLocale(locale)) {
    appNotFound();
  }
  setServerLocale(locale);
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.pwa });
  return (
    <PageContainer>
      <Stack gap="md">
        <h1>{t('offlineTitle')}</h1>
        <p>{t('offlineDescription')}</p>
      </Stack>
    </PageContainer>
  );
}
