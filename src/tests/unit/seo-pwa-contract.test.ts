import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import manifest from '@/app/manifest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import type * as PackagesI18n from '@/packages/i18n';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/packages/i18n';
import { appConfig } from '@/shared/config/app-config';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import {
  INDEXABLE_PATHS,
  NON_INDEXABLE_PATHS,
  SOCIAL_IMAGE_DIRECTORY,
  SOCIAL_IMAGE_SIZE,
} from '@/shared/constants/seo.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import {
  buildAbsoluteAppUrl,
  buildLanguageAlternates,
  buildNonIndexableMetadata,
  buildSeoMetadata,
} from '@/shared/helpers/seo-metadata.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';
import { stubServerTranslations } from '@/tests/helpers/stub-server-translations';

vi.mock('@/packages/i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof PackagesI18n>();
  return {
    ...actual,
    setServerLocale: () => {},
    getServerTranslations: ({
      locale,
      namespace,
    }: {
      locale: PackagesI18n.AppLocale;
      namespace: string;
    }) => stubServerTranslations(locale, namespace),
  };
});

const { buildRouteMetadata } = await import('@/shared/helpers/route-metadata.helper');

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const serviceWorkerSource = readFileSync(path.join(repoRoot, 'public/sw.js'), 'utf8');
const iconSource = readFileSync(path.join(repoRoot, 'public/icons/icon.svg'), 'utf8');

describe('SEO and PWA contracts', () => {
  it('builds reciprocal locale alternates including x-default', () => {
    const alternates = buildLanguageAlternates('/projects');

    expect(Object.keys(alternates)).toHaveLength(SUPPORTED_LOCALES.length + 1);
    expect(alternates['x-default']).toContain(`/${DEFAULT_LOCALE}/projects`);
    for (const locale of SUPPORTED_LOCALES) {
      expect(alternates[locale]).toContain(`/${locale}/projects`);
    }
  });

  it('builds complete indexable metadata with locale-specific social tags', () => {
    const metadata = buildSeoMetadata({
      locale: 'fr',
      path: '/projects',
      title: 'Projets',
      description: 'Systèmes publics et travaux professionnels sélectionnés.',
      keywords: ['Node.js', 'TypeScript'],
      socialImageAlt: `Projets · ${appConfig.appName}`,
    });

    expect(metadata).toEqual(
      expect.objectContaining({
        applicationName: appConfig.appName,
        title: 'Projets',
        description: 'Systèmes publics et travaux professionnels sélectionnés.',
        keywords: ['Node.js', 'TypeScript'],
        publisher: appConfig.appName,
        robots: { index: true, follow: true },
      }),
    );
    expect(metadata.alternates?.canonical).toBe(buildAbsoluteAppUrl('/fr/projects'));
    expect(metadata.alternates?.languages?.fr).toBe(buildAbsoluteAppUrl('/fr/projects'));
    expect(metadata.alternates?.languages?.['x-default']).toBe(buildAbsoluteAppUrl('/en/projects'));
    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        locale: 'fr_FR',
        url: buildAbsoluteAppUrl('/fr/projects'),
        title: 'Projets',
        images: [
          {
            url: buildAbsoluteAppUrl(`${SOCIAL_IMAGE_DIRECTORY}/fr.png`),
            width: SOCIAL_IMAGE_SIZE.width,
            height: SOCIAL_IMAGE_SIZE.height,
            alt: `Projets · ${appConfig.appName}`,
          },
        ],
      }),
    );
    const alternateLocales =
      metadata.openGraph && !Array.isArray(metadata.openGraph)
        ? metadata.openGraph.alternateLocale
        : undefined;
    expect(alternateLocales).not.toContain('fr_FR');
    expect(metadata.twitter).toEqual(
      expect.objectContaining({
        card: 'summary_large_image',
        title: 'Projets',
        images: [
          {
            url: buildAbsoluteAppUrl(`${SOCIAL_IMAGE_DIRECTORY}/fr.png`),
            alt: `Projets · ${appConfig.appName}`,
          },
        ],
      }),
    );
  });

  it('keeps private metadata out of search results', () => {
    const metadata = buildNonIndexableMetadata(`Offline · ${appConfig.appName}`);

    expect(metadata.title).toBe(`Offline · ${appConfig.appName}`);
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('omits an undefined title from private metadata', () => {
    expect(buildNonIndexableMetadata()).toEqual({
      robots: { index: false, follow: false },
    });
  });

  it('lists every public document with reciprocal alternates', () => {
    const entries = sitemap();

    expect(entries).toHaveLength(INDEXABLE_PATHS.length * SUPPORTED_LOCALES.length);
    expect(
      entries.every(
        (entry) =>
          Object.keys(entry.alternates?.languages ?? {}).length === SUPPORTED_LOCALES.length + 1,
      ),
    ).toBe(true);
  });

  it('publishes a default-locale manifest and protected crawler routes', () => {
    expect(manifest().start_url).toBe(buildLocalizedPath(DEFAULT_LOCALE, '/'));
    expect(manifest().theme_color).toBe('#2258d8');
    expect(manifest().background_color).toBe('#f7f8fa');
    expect(iconSource).toContain('#2258D8');

    const crawlerRules = robots().rules;
    expect(crawlerRules).not.toBeInstanceOf(Array);
    expect(crawlerRules).toEqual(expect.objectContaining({ userAgent: '*' }));
    const disallowed = Array.isArray(crawlerRules) ? undefined : crawlerRules.disallow;
    expect(disallowed).toContain('/api/');
    for (const locale of SUPPORTED_LOCALES) {
      for (const path of NON_INDEXABLE_PATHS) {
        expect(disallowed).toContain(buildLocalizedPath(locale, path));
      }
    }
  });

  it('keeps service-worker locale and request exclusions aligned', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(serviceWorkerSource).toContain(`'${locale}'`);
    }
    expect(serviceWorkerSource).toContain('key.startsWith(CACHE_PREFIX)');
    expect(serviceWorkerSource).toContain("url.pathname.startsWith('/api/')");
    expect(serviceWorkerSource).toContain("request.headers.has('RSC')");
    expect(serviceWorkerSource).toContain("request.method !== 'GET'");
  });

  it('allows only the public portfolio routes and the offline fallback', () => {
    for (const path of [
      '',
      '/experience',
      '/projects',
      '/skills',
      '/about',
      '/resume',
      '/contact',
      '/offline',
    ]) {
      expect(serviceWorkerSource).toContain(`'${path}'`);
    }
    expect(serviceWorkerSource).toContain('!isPublicNavigationPath(url.pathname)');
  });

  it('brands a section title for a regular route', async () => {
    const metadata = await buildRouteMetadata({
      locale: 'en',
      path: ROUTE_PATHS.projects,
      namespace: I18N_NAMESPACES.projects,
      titleKey: 'title',
      descriptionKey: 'description',
    });

    expect(metadata.title).toBe(`Projects · ${appConfig.appName}`);
  });

  it('does not re-brand a title that already is the app name', async () => {
    const metadata = await buildRouteMetadata({
      locale: 'en',
      path: ROUTE_PATHS.home,
      namespace: I18N_NAMESPACES.app,
      titleKey: 'seoTitle',
      descriptionKey: 'description',
      brandTitle: false,
    });

    expect(metadata.title).toContain(appConfig.appName);
    expect(metadata.title).not.toContain(`${appConfig.appName} · ${appConfig.appName}`);
  });

  it('defaults keywords to an empty list when none are given', async () => {
    const metadata = await buildRouteMetadata({
      locale: 'en',
      path: ROUTE_PATHS.about,
      namespace: I18N_NAMESPACES.about,
      titleKey: 'title',
      descriptionKey: 'description',
    });

    expect(metadata.keywords).toEqual([]);
  });
});
