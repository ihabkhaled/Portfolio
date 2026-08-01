import type { AppLocale } from '@/packages/i18n';

import type { I18nNamespace } from '../i18n/i18n-namespaces.constants';

export interface SeoMetadataInput {
  readonly locale: AppLocale;
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly socialImageAlt: string;
}

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

export interface PersonStructuredDataInput {
  readonly name: string;
  readonly jobTitle: string;
  readonly url: string;
  readonly sameAs: readonly string[];
  readonly addressLocality: string;
  readonly addressCountry: string;
  readonly telephone: string;
}

export interface WebsiteStructuredDataInput {
  readonly name: string;
  readonly url: string;
  readonly locale: AppLocale;
}

export interface BreadcrumbListItemInput {
  readonly name: string;
  readonly url: string;
}

export interface BreadcrumbListInput {
  readonly items: readonly BreadcrumbListItemInput[];
}

export interface SoftwareSourceCodeInput {
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly codeRepository: string | null;
  readonly keywords: readonly string[];
  readonly authorName: string;
  readonly authorUrl: string;
}
