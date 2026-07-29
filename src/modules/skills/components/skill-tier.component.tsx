import type { ReactElement } from 'react';

import { skillsClasses } from '../constants/skills-style.constants';
import type { SkillTierProps } from '../types/skill-tier.types';

export function SkillTierSection(props: SkillTierProps): ReactElement {
  return (
    <section className={skillsClasses.tier} aria-labelledby={props.headingId}>
      <div className={skillsClasses.tierHead}>
        <h2 id={props.headingId} className={skillsClasses.tierName}>
          {props.name}
        </h2>
        <p className={skillsClasses.tierDefinition}>{props.definition}</p>
      </div>
      <div className={skillsClasses.tierTechnologies}>{props.technologies}</div>
    </section>
  );
}
