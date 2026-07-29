import type { ReactElement } from 'react';

import { buildRepositoryActivityReport } from '@/modules/github-profile';
import { getServerTranslations } from '@/packages/i18n';
import { AppLink, ExternalLink } from '@/packages/link';
import { appNotFound } from '@/packages/navigation';
import { Badge } from '@/packages/ui-primitives';
import { ManifestPanel, ManifestRow } from '@/shared/components/data-display/section.component';
import { sectionClasses } from '@/shared/components/data-display/section.variants';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { caseStudyClasses, projectRowClasses } from '../constants/projects-style.constants';
import { PROJECTS } from '../constants/projects.constants';
import { findProjectBySlug } from '../helpers/project-filter.helper';
import type { CaseStudyPageContainerProps } from '../types/case-study.types';

export async function CaseStudyPageContainer(
  props: CaseStudyPageContainerProps,
): Promise<ReactElement> {
  const { locale, slug } = props;
  const project = findProjectBySlug(PROJECTS, slug);

  if (project?.hasCaseStudy !== true) {
    appNotFound();
  }

  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.projects });
  const tGithub = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.github });

  const activity = await buildRepositoryActivityReport(
    project.repositoryName === null ? [] : [project.repositoryName],
  );
  const snapshot = activity.repositories[0];

  const stack = project.stack.map((technology) => (
    <Badge key={technology} tone="outline">
      {technology}
    </Badge>
  ));

  const manifestRows = [
    { label: t('roleLabel'), value: t(`items.${project.slug}.role`) },
    { label: t('categoryLabel'), value: t(`filters.${project.categories[0] ?? 'all'}`) },
    { label: t('stackLabel'), value: stack },
  ];
  if (snapshot?.primaryLanguage !== undefined && snapshot.primaryLanguage !== null) {
    manifestRows.push({ label: tGithub('languageLabel'), value: snapshot.primaryLanguage });
  }
  if (snapshot?.license !== undefined && snapshot.license !== null) {
    manifestRows.push({ label: tGithub('licenseLabel'), value: snapshot.license });
  }

  const links: { label: string; href: string }[] = [];
  if (project.links.repository !== null) {
    links.push({ label: t('repositoryLabel'), href: project.links.repository });
  }
  if (project.links.live !== null) {
    links.push({ label: t('liveLabel'), href: project.links.live });
  }

  return (
    <div className={sectionClasses.page}>
      <div className={sectionClasses.pageHeader}>
        <AppLink
          href={buildLocalizedPath(locale, ROUTE_PATHS.projects)}
          className={caseStudyClasses.back}
        >
          {t('backToProjects')}
        </AppLink>
        <p className={sectionClasses.eyebrow}>
          {project.kind === 'open-source' ? t('openSourceLabel') : t('professionalLabel')}
        </p>
        <h1 className={sectionClasses.pageTitle}>{project.name}</h1>
        <p className={sectionClasses.pageLead}>{t(`items.${project.slug}.summary`)}</p>
        {project.kind === 'professional' ? (
          <p className={caseStudyClasses.note}>{t('professionalNote')}</p>
        ) : null}
      </div>

      <div className={caseStudyClasses.layout}>
        <div className={caseStudyClasses.body}>
          <div className={caseStudyClasses.block}>
            <h2 className={caseStudyClasses.blockTitle}>{t('overviewTitle')}</h2>
            <p className={caseStudyClasses.paragraph}>{t(`items.${project.slug}.overview`)}</p>
          </div>
          <div className={caseStudyClasses.block}>
            <h2 className={caseStudyClasses.blockTitle}>{t('architectureTitle')}</h2>
            <p className={caseStudyClasses.paragraph}>{t(`items.${project.slug}.architecture`)}</p>
          </div>
          <div className={caseStudyClasses.block}>
            <h2 className={caseStudyClasses.blockTitle}>{t('engineeringTitle')}</h2>
            <p className={caseStudyClasses.paragraph}>{t(`items.${project.slug}.engineering`)}</p>
          </div>
        </div>
        <div className={caseStudyClasses.aside}>
          <ManifestPanel
            rows={manifestRows.map((row) => (
              <ManifestRow key={row.label} {...row} />
            ))}
          />
          {links.length > 0 ? (
            <div className={projectRowClasses.links}>
              {links.map((link) => (
                <ExternalLink
                  key={link.href}
                  href={link.href}
                  className={projectRowClasses.externalLink}
                >
                  {link.label}
                </ExternalLink>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
