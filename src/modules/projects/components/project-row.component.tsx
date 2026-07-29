import type { ReactElement } from 'react';

import { AppLink } from '@/packages/link';
import { Badge } from '@/packages/ui-primitives';

import { projectRowClasses } from '../constants/projects-style.constants';
import type { ProjectRowProps } from '../types/projects.types';

/**
 * One editorial row. The whole row is a single link to the case study when one
 * exists; external links sit outside it so they never nest inside an anchor.
 */
export function ProjectRow(props: ProjectRowProps): ReactElement {
  const body = (
    <>
      <div className={projectRowClasses.head}>
        <div className={projectRowClasses.titleRow}>
          <h3 className={projectRowClasses.name}>{props.name}</h3>
          <Badge tone={props.isOpenSource ? 'brand' : 'neutral'}>{props.kindLabel}</Badge>
          {props.isRecentlyActive ? (
            <Badge tone="success">
              <span className={projectRowClasses.dot} aria-hidden="true" />
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

  return (
    <li className={projectRowClasses.item}>
      <span className={projectRowClasses.accent} aria-hidden="true" />
      {props.caseStudyHref === null ? (
        <div className={projectRowClasses.link}>{body}</div>
      ) : (
        <AppLink href={props.caseStudyHref} className={projectRowClasses.link}>
          {body}
        </AppLink>
      )}
    </li>
  );
}
