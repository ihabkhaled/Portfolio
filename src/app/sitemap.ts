import type { MetadataRoute } from 'next';

import { PROJECTS } from '@/modules/projects';
import { SUPPORTED_LOCALES } from '@/packages/i18n';
import { buildProjectPath, ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { INDEXABLE_PATHS } from '@/shared/constants/seo.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { buildAbsoluteAppUrl, buildLanguageAlternates } from '@/shared/helpers/seo-metadata.helper';

const CASE_STUDY_PATHS = PROJECTS.filter((project) => project.hasCaseStudy).map((project) =>
  buildProjectPath(project.slug),
);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = INDEXABLE_PATHS.flatMap((path) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: buildAbsoluteAppUrl(buildLocalizedPath(locale, path)),
      changeFrequency: path === ROUTE_PATHS.home ? ('weekly' as const) : ('monthly' as const),
      priority: path === ROUTE_PATHS.home ? 1 : 0.7,
      alternates: { languages: buildLanguageAlternates(path) },
    })),
  );

  const caseStudyEntries = CASE_STUDY_PATHS.flatMap((path) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: buildAbsoluteAppUrl(buildLocalizedPath(locale, path)),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: { languages: buildLanguageAlternates(path) },
    })),
  );

  return [...staticEntries, ...caseStudyEntries];
}
