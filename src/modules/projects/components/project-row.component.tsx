import type { ReactElement } from 'react';

import { AppLink } from '@/packages/link';
import { Badge } from '@/packages/ui-primitives';

import { projectRowClasses } from '../constants/projects-style.constants';
import type { ProjectRowProperties } from '../types/projects.types';

/**
The row's metadata and copy. Rendered inside either a link or a plain div.
*/
export function ProjectRowBody(properties: ProjectRowProperties): ReactElement {
  return (
    <>
      <div className={projectRowClasses.head}>
        <div className={projectRowClasses.titleRow}>
          <h3 className={projectRowClasses.name}>{properties.name}</h3>
          <Badge tone={properties.isOpenSource ? 'brand' : 'neutral'}>{properties.kindLabel}</Badge>
          {properties.isRecentlyActive ? (
            <Badge tone="success">
              <span className={projectRowClasses.dot} aria-hidden />
              {properties.recentlyActiveLabel}
            </Badge>
          ) : null}
        </div>
        <p className={projectRowClasses.summary}>{properties.summary}</p>
        <p className={projectRowClasses.role}>{properties.role}</p>
      </div>
      <div className={projectRowClasses.meta}>
        <div className={projectRowClasses.stack}>{properties.stack}</div>
        <div className={projectRowClasses.metaRow}>{properties.metrics}</div>
        {properties.caseStudyLabel === null ? null : (
          <p className={projectRowClasses.cta}>{properties.caseStudyLabel}</p>
        )}
      </div>
    </>
  );
}

/**
 * One editorial row. The whole row is a single link to the case study when one
 * exists; external links sit outside it so they never nest inside an anchor.
 */
export function ProjectRow(properties: ProjectRowProperties): ReactElement {
  return (
    <li className={projectRowClasses.item}>
      <span className={projectRowClasses.accent} aria-hidden />
      {properties.caseStudyHref === null ? (
        <div className={projectRowClasses.link}>
          <ProjectRowBody {...properties} />
        </div>
      ) : (
        <AppLink href={properties.caseStudyHref} className={projectRowClasses.link}>
          <ProjectRowBody {...properties} />
        </AppLink>
      )}
    </li>
  );
}
