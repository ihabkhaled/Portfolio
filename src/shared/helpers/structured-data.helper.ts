import type {
  BreadcrumbListInput,
  PersonStructuredDataInput,
  SoftwareSourceCodeInput,
  WebsiteStructuredDataInput,
} from '@/shared/types/seo.types';

/**
 * `<script type="application/ld+json">` accepts raw JSON text as children —
 * never `dangerouslySetInnerHTML` — but a literal `</script>` inside a JSON
 * string value would still close the tag early, so `<` is escaped to the
 * equivalent unicode form first.
 */
export function serializeStructuredData(data: Readonly<Record<string, unknown>>): string {
  return JSON.stringify(data).replaceAll('<', String.raw`\u003c`);
}

export function buildPersonStructuredData(
  input: PersonStructuredDataInput,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    jobTitle: input.jobTitle,
    url: input.url,
    sameAs: [...input.sameAs],
    telephone: input.telephone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: input.addressLocality,
      addressCountry: input.addressCountry,
    },
  };
}

export function buildWebsiteStructuredData(
  input: WebsiteStructuredDataInput,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.name,
    url: input.url,
    inLanguage: input.locale,
  };
}

export function buildBreadcrumbStructuredData(input: BreadcrumbListInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: input.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildSoftwareSourceCodeStructuredData(
  input: SoftwareSourceCodeInput,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.codeRepository === null ? {} : { codeRepository: input.codeRepository }),
    keywords: input.keywords.join(', '),
    author: { '@type': 'Person', name: input.authorName, url: input.authorUrl },
  };
}
