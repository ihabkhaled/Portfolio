import type { ReactElement } from 'react';

import { skillsClasses } from '../constants/skills-style.constants';
import type { SkillTierProperties } from '../types/skill-tier.types';

export function SkillTierSection(properties: SkillTierProperties): ReactElement {
  return (
    <section className={skillsClasses.tier} aria-labelledby={properties.headingId}>
      <div className={skillsClasses.tierHead}>
        <h2 id={properties.headingId} className={skillsClasses.tierName}>
          {properties.name}
        </h2>
        <p className={skillsClasses.tierDefinition}>{properties.definition}</p>
      </div>
      <div className={skillsClasses.tierTechnologies}>{properties.technologies}</div>
    </section>
  );
}
