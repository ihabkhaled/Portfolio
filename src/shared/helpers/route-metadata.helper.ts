import type { Metadata } from 'next';

import { getServerTranslations, setServerLocale } from '@/packages/i18n';
import type { RouteMetadataInput } from '@/shared/types/seo.types';

import { buildPageTitle } from './page-title.helper';
import { buildSeoMetadata } from './seo-metadata.helper';

/**
 * Builds fully localized metadata for one route: branded title, translated
 * description, canonical URL and hreflang alternates for every locale.
 */
export async function buildRouteMetadata(input: RouteMetadataInput): Promise<Metadata> {
  setServerLocale(input.locale);
  const t = await getServerTranslations({ locale: input.locale, namespace: input.namespace });
  const title = t(input.titleKey);
  const brandedTitle = input.brandTitle === false ? title : buildPageTitle(title);

  return buildSeoMetadata({
    locale: input.locale,
    path: input.path,
    title: brandedTitle,
    description: t(input.descriptionKey),
    socialImageAlt: brandedTitle,
    keywords: input.keywords ?? [],
  });
}
