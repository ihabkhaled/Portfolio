import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { HomePageContainer } from '@/modules/profile';
import { isSupportedLocale } from '@/packages/i18n';
import { appNotFound } from '@/packages/navigation';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { buildRouteMetadata } from '@/shared/helpers/route-metadata.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';
import type { LocaleRouteProperties } from '@/shared/types/app-route.types';

export async function generateMetadata(properties: LocaleRouteProperties): Promise<Metadata> {
  const { locale } = await properties.params;
  if (!isSupportedLocale(locale)) return {};
  return buildRouteMetadata({
    locale,
    path: ROUTE_PATHS.home,
    namespace: I18N_NAMESPACES.app,
    titleKey: 'seoTitle',
    descriptionKey: 'description',
    brandTitle: false,
  });
}

export default async function HomePage(properties: LocaleRouteProperties): Promise<ReactElement> {
  const { locale } = await properties.params;
  if (!isSupportedLocale(locale)) {
    appNotFound();
  }
  return <HomePageContainer locale={locale} />;
}
