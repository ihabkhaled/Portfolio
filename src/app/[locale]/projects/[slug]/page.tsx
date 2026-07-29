import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { CaseStudyPageContainer, listCaseStudySlugs, PROJECTS } from '@/modules/projects';
import { getServerTranslations, isSupportedLocale, SUPPORTED_LOCALES } from '@/packages/i18n';
import { appNotFound } from '@/packages/navigation';
import { buildProjectPath } from '@/shared/constants/route-paths.constants';
import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { buildSeoMetadata } from '@/shared/helpers/seo-metadata.helper';
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
  return <CaseStudyPageContainer locale={locale} slug={slug} />;
}
