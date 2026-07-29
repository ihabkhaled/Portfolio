import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { AboutPageContainer } from '@/modules/about';
import { isSupportedLocale } from '@/packages/i18n';
import { appNotFound } from '@/packages/navigation';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { buildRouteMetadata } from '@/shared/helpers/route-metadata.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';
import type { LocaleRouteProps } from '@/shared/types/app-route.types';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isSupportedLocale(locale)) return {};
  return buildRouteMetadata({
    locale,
    path: ROUTE_PATHS.about,
    namespace: I18N_NAMESPACES.about,
    titleKey: 'title',
    descriptionKey: 'description',
  });
}

export default async function AboutPage(props: LocaleRouteProps): Promise<ReactElement> {
  const { locale } = await props.params;
  if (!isSupportedLocale(locale)) {
    appNotFound();
  }
  return <AboutPageContainer locale={locale} />;
}
