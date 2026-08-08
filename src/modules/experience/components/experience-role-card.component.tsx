import type { ReactElement } from 'react';

import { experienceClasses } from '../constants/experience-style.constants';
import type {
  ExperienceRoleCardProperties,
  ExperienceRoleGroupProperties,
} from '../types/experience.types';

export function ExperienceRoleCard(properties: ExperienceRoleCardProperties): ReactElement {
  return (
    <article className={experienceClasses.role}>
      <div className={experienceClasses.roleHead}>
        <div>
          <h3 className={experienceClasses.organisation}>{properties.organisation}</h3>
          <p className={experienceClasses.title}>{properties.title}</p>
        </div>
        <p className={experienceClasses.dateRange}>{properties.dateRange}</p>
      </div>
      <p className={experienceClasses.summary}>{properties.summary}</p>
      <ul className={experienceClasses.highlights}>{properties.highlights}</ul>
      <div className={experienceClasses.stack}>{properties.stack}</div>
      {properties.websiteLink}
    </article>
  );
}

export function ExperienceRoleGroup(properties: ExperienceRoleGroupProperties): ReactElement {
  return (
    <section>
      <h2 className={experienceClasses.groupTitle}>{properties.title}</h2>
      <div className={experienceClasses.list}>{properties.roles}</div>
    </section>
  );
}
