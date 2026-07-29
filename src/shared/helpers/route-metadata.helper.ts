import type { Metadata } from 'next';

import { getServerTranslations, setServerLocale, type AppLocale } from '@/packages/i18n';
import type { I18nNamespace } from '@/shared/i18n/i18n-namespaces.constants';

import { buildPageTitle } from './page-title.helper';
import { buildSeoMetadata } from './seo-metadata.helper';

export interface RouteMetadataInput {
  readonly locale: AppLocale;
  readonly path: string;
  readonly namespace: I18nNamespace;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly keywords?: readonly string[];
  /** Home already carries the full name; branding it again would repeat it. */
  readonly brandTitle?: boolean;
}

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
