import type { ReactElement } from 'react';

import { heroClasses } from '../constants/profile-style.constants';
import type { HeroProperties } from '../types/profile.types';

/**
Claim on the left, evidence on the right. No typing effects, no particles.
*/
export function Hero(properties: HeroProperties): ReactElement {
  return (
    <div className={heroClasses.wrapper}>
      <div className={heroClasses.grid} aria-hidden />
      <div className={heroClasses.inner}>
        <div className={heroClasses.content}>
          <div className={heroClasses.coverFrame}>{properties.cover}</div>
          <p className={heroClasses.eyebrow}>{properties.eyebrow}</p>
          <h1 className={heroClasses.name}>{properties.name}</h1>
          <p className={heroClasses.role}>{properties.role}</p>
          <p className={heroClasses.tagline}>{properties.tagline}</p>
          <p className={heroClasses.valueProp}>{properties.valueProp}</p>
          <div className={heroClasses.actions}>
            {properties.primaryAction}
            {properties.secondaryAction}
            {properties.tertiaryAction}
          </div>
          <div className={heroClasses.socialRow}>{properties.socialLinks}</div>
        </div>
        <div className={heroClasses.aside}>{properties.aside}</div>
      </div>
    </div>
  );
}
