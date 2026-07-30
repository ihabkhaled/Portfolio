import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { PUBLIC_PROFILE } from '@/modules/profile';
import { CaseStudyPageContainer, listCaseStudySlugs, PROJECTS } from '@/modules/projects';
import { getServerTranslations, isSupportedLocale, SUPPORTED_LOCALES } from '@/packages/i18n';
import { appNotFound } from '@/packages/navigation';
import { StructuredDataScript } from '@/shared/components/seo/structured-data-script.component';
import { ROUTE_PATHS, buildProjectPath } from '@/shared/constants/route-paths.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { buildAbsoluteAppUrl, buildSeoMetadata } from '@/shared/helpers/seo-metadata.helper';
import {
  buildBreadcrumbStructuredData,
  buildSoftwareSourceCodeStructuredData,
  serializeStructuredData,
} from '@/shared/helpers/structured-data.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

interface CaseStudyRouteProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams(): { locale: string; slug: string }[] {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    listCaseStudySlugs(PROJECTS).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata(props: CaseStudyRouteProps): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!isSupportedLocale(locale)) return {};
  const project = PROJECTS.find((candidate) => candidate.slug === slug && candidate.hasCaseStudy);
  if (project === undefined) return {};

  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.projects });
  const title = buildPageTitle(project.name);
  return buildSeoMetadata({
    locale,
    path: buildProjectPath(slug),
    title,
    description: t(`items.${slug}.summary`),
    socialImageAlt: title,
    keywords: project.stack,
  });
}

export default async function CaseStudyPage(props: CaseStudyRouteProps): Promise<ReactElement> {
  const { locale, slug } = await props.params;
  if (!isSupportedLocale(locale)) {
    appNotFound();
  }
  const project = PROJECTS.find((candidate) => candidate.slug === slug && candidate.hasCaseStudy);
  if (project === undefined) {
    appNotFound();
  }

  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.projects });
  const tNav = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.nav });
  const homeUrl = buildAbsoluteAppUrl(buildLocalizedPath(locale, ROUTE_PATHS.home));
  const projectsUrl = buildAbsoluteAppUrl(buildLocalizedPath(locale, ROUTE_PATHS.projects));
  const projectUrl = buildAbsoluteAppUrl(buildLocalizedPath(locale, buildProjectPath(slug)));

  const breadcrumbJsonLd = serializeStructuredData(
    buildBreadcrumbStructuredData({
      items: [
        { name: tNav('home'), url: homeUrl },
        { name: tNav('projects'), url: projectsUrl },
        { name: project.name, url: projectUrl },
      ],
    }),
  );
  const softwareJsonLd = serializeStructuredData(
    buildSoftwareSourceCodeStructuredData({
      name: project.name,
      description: t(`items.${slug}.summary`),
      url: projectUrl,
      codeRepository: project.links.repository,
      keywords: project.stack,
      authorName: PUBLIC_PROFILE.displayName,
      authorUrl: homeUrl,
    }),
  );

  return (
    <>
      <StructuredDataScript json={breadcrumbJsonLd} />
      <StructuredDataScript json={softwareJsonLd} />
      <CaseStudyPageContainer locale={locale} slug={slug} />
    </>
  );
}
