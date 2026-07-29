import type { ReactElement } from 'react';

import { AppLink } from '@/packages/link';
import { Badge } from '@/packages/ui-primitives';

import { projectRowClasses } from '../constants/projects-style.constants';
import type { ProjectRowProps } from '../types/projects.types';

/** The row's metadata and copy. Rendered inside either a link or a plain div. */
export function ProjectRowBody(props: ProjectRowProps): ReactElement {
  return (
    <>
      <div className={projectRowClasses.head}>
        <div className={projectRowClasses.titleRow}>
          <h3 className={projectRowClasses.name}>{props.name}</h3>
          <Badge tone={props.isOpenSource ? 'brand' : 'neutral'}>{props.kindLabel}</Badge>
          {props.isRecentlyActive ? (
            <Badge tone="success">
              <span className={projectRowClasses.dot} aria-hidden />
              {props.recentlyActiveLabel}
            </Badge>
          ) : null}
        </div>
        <p className={projectRowClasses.summary}>{props.summary}</p>
        <p className={projectRowClasses.role}>{props.role}</p>
      </div>
      <div className={projectRowClasses.meta}>
        <div className={projectRowClasses.stack}>{props.stack}</div>
        <div className={projectRowClasses.metaRow}>{props.metrics}</div>
        {props.caseStudyLabel === null ? null : (
          <p className={projectRowClasses.cta}>{props.caseStudyLabel}</p>
        )}
      </div>
    </>
  );
}

/**
 * One editorial row. The whole row is a single link to the case study when one
 * exists; external links sit outside it so they never nest inside an anchor.
 */
export function ProjectRow(props: ProjectRowProps): ReactElement {
  return (
    <li className={projectRowClasses.item}>
      <span className={projectRowClasses.accent} aria-hidden />
      {props.caseStudyHref === null ? (
        <div className={projectRowClasses.link}>
          <ProjectRowBody {...props} />
        </div>
      ) : (
        <AppLink href={props.caseStudyHref} className={projectRowClasses.link}>
          <ProjectRowBody {...props} />
        </AppLink>
      )}
    </li>
  );
}
