import type { ReactElement } from 'react';

import { indexSnapshotsByName } from '@/modules/github-profile';
import { getServerTranslations } from '@/packages/i18n';
import { Badge } from '@/packages/ui-primitives';
import { buildProjectPath } from '@/shared/constants/route-paths.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { ProjectRow } from '../components/project-row.component';
import { projectRowClasses } from '../constants/projects-style.constants';
import { isRecentlyActive } from '../helpers/project-filter.helper';
import type { ProjectListContainerProps } from '../types/projects.types';

/**
 * Renders the editorial project rows. Live GitHub metadata is layered on top of
 * the static catalog when present; when it is absent the row simply shows less,
 * never a placeholder or a zero.
 */
export async function ProjectListContainer(
  props: ProjectListContainerProps,
): Promise<ReactElement> {
  const t = await getServerTranslations({
    locale: props.locale,
    namespace: I18N_NAMESPACES.projects,
  });
  const tGithub = await getServerTranslations({
    locale: props.locale,
    namespace: I18N_NAMESPACES.github,
  });
  const byName = indexSnapshotsByName(props.snapshots);

  const rows = props.projects.map((project) => {
    const snapshot =
      project.repositoryName === null ? undefined : byName.get(project.repositoryName);
    const lastActivity = snapshot?.lastActivityAt ?? project.fallbackUpdatedAt;

    const stack = project.stack.map((technology) => (
      <Badge key={technology} tone="outline">
        {technology}
      </Badge>
    ));

    const metrics = [
      snapshot?.primaryLanguage === undefined || snapshot.primaryLanguage === null
        ? null
        : { key: 'language', text: snapshot.primaryLanguage },
      snapshot?.stars === undefined || snapshot.stars === null
        ? null
        : { key: 'stars', text: tGithub('stars', { count: snapshot.stars }) },
      snapshot?.license === undefined || snapshot.license === null
        ? null
        : { key: 'license', text: snapshot.license },
    ].filter((entry): entry is { key: string; text: string } => entry !== null);

    return (
      <ProjectRow
        key={project.slug}
        name={project.name}
        summary={t(`items.${project.slug}.summary`)}
        role={t(`items.${project.slug}.role`)}
        kindLabel={project.kind === 'open-source' ? t('openSourceLabel') : t('professionalLabel')}
        isOpenSource={project.kind === 'open-source'}
        isRecentlyActive={isRecentlyActive(lastActivity, props.now)}
        recentlyActiveLabel={tGithub('recentlyActive')}
        stack={stack}
        metrics={metrics.map((entry) => (
          <span key={entry.key} className={projectRowClasses.metaItem}>
            {entry.text}
          </span>
        ))}
        caseStudyHref={
          project.hasCaseStudy
            ? buildLocalizedPath(props.locale, buildProjectPath(project.slug))
            : null
        }
        caseStudyLabel={project.hasCaseStudy ? t('caseStudy') : null}
      />
    );
  });

  return <ul className={projectRowClasses.list}>{rows}</ul>;
}
