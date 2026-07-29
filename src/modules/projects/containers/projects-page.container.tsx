import type { ReactElement } from 'react';

import { buildRepositoryActivityReport, indexSnapshotsByName } from '@/modules/github-profile';
import { getServerTranslations } from '@/packages/i18n';
import { Badge } from '@/packages/ui-primitives';
import { PageIntro } from '@/shared/components/data-display/section.component';
import { sectionClasses } from '@/shared/components/data-display/section.variants';
import { buildProjectPath } from '@/shared/constants/route-paths.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { ProjectRow } from '../components/project-row.component';
import { projectRowClasses } from '../constants/projects-style.constants';
import { CURATED_REPOSITORY_NAMES, PROJECTS } from '../constants/projects.constants';
import {
  isRecentlyActive,
  listAvailableCategories,
  sortProjectsByPriority,
} from '../helpers/project-filter.helper';
import { buildRepositoryMetricLabels } from '../helpers/project-metrics.helper';
import type { ProjectsPageContainerProps } from '../types/project-filter.types';
import { PROJECT_CATEGORIES, type ProjectCategory } from '../types/projects.types';

import { ProjectsFilterContainer } from './projects-filter.container';

export async function ProjectsPageContainer(
  props: ProjectsPageContainerProps,
): Promise<ReactElement> {
  const { locale } = props;
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.projects });
  const tGithub = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.github });

  const activity = await buildRepositoryActivityReport(CURATED_REPOSITORY_NAMES);
  const byName = indexSnapshotsByName(activity.repositories);
  const now = new Date();

  const projects = sortProjectsByPriority(PROJECTS);
  const entries = projects.map((project) => {
    const snapshot =
      project.repositoryName === null ? undefined : byName.get(project.repositoryName);
    const lastActivity = snapshot?.lastActivityAt ?? project.fallbackUpdatedAt;
    const stack = project.stack.map((technology) => (
      <Badge key={technology} tone="outline">
        {technology}
      </Badge>
    ));
    const metrics = buildRepositoryMetricLabels(snapshot, (count) =>
      tGithub('stars', { count }),
    ).map((text) => (
      <span key={text} className={projectRowClasses.metaItem}>
        {text}
      </span>
    ));

    return {
      slug: project.slug,
      categories: project.categories,
      node: (
        <ProjectRow
          key={project.slug}
          name={project.name}
          summary={t(`items.${project.slug}.summary`)}
          role={t(`items.${project.slug}.role`)}
          kindLabel={project.kind === 'open-source' ? t('openSourceLabel') : t('professionalLabel')}
          isOpenSource={project.kind === 'open-source'}
          isRecentlyActive={isRecentlyActive(lastActivity, now)}
          recentlyActiveLabel={tGithub('recentlyActive')}
          stack={stack}
          metrics={metrics}
          caseStudyHref={
            project.hasCaseStudy ? buildLocalizedPath(locale, buildProjectPath(project.slug)) : null
          }
          caseStudyLabel={project.hasCaseStudy ? t('caseStudy') : null}
        />
      ),
    };
  });

  const availableCategories = listAvailableCategories(projects, PROJECT_CATEGORIES);
  const categoryLabels = Object.fromEntries(
    PROJECT_CATEGORIES.map((category) => [category, t(`filters.${category}`)]),
  ) as Record<ProjectCategory, string>;

  return (
    <div className={sectionClasses.page}>
      <PageIntro eyebrow={t('eyebrow')} title={t('title')} lead={t('description')} />
      <div className={sectionClasses.body}>
        <ProjectsFilterContainer
          entries={entries}
          categories={availableCategories}
          categoryLabels={categoryLabels}
          filtersLabel={t('filtersLabel')}
          emptyLabel={t('empty')}
        />
      </div>
    </div>
  );
}
