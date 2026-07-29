import type { ReactElement } from 'react';

import { experienceClasses } from '../constants/experience-style.constants';
import type { ExperienceRoleCardProps, ExperienceRoleGroupProps } from '../types/experience.types';

export function ExperienceRoleCard(props: ExperienceRoleCardProps): ReactElement {
  return (
    <article className={experienceClasses.role}>
      <div className={experienceClasses.roleHead}>
        <div>
          <h3 className={experienceClasses.organisation}>{props.organisation}</h3>
          <p className={experienceClasses.title}>{props.title}</p>
        </div>
        <p className={experienceClasses.dateRange}>{props.dateRange}</p>
      </div>
      <p className={experienceClasses.summary}>{props.summary}</p>
      <ul className={experienceClasses.highlights}>{props.highlights}</ul>
      <div className={experienceClasses.stack}>{props.stack}</div>
      {props.websiteLink}
    </article>
  );
}

export function ExperienceRoleGroup(props: ExperienceRoleGroupProps): ReactElement {
  return (
    <section>
      <h2 className={experienceClasses.groupTitle}>{props.title}</h2>
      <div className={experienceClasses.list}>{props.roles}</div>
    </section>
  );
}
