import type { ReactElement } from 'react';

import { heroClasses } from '../constants/profile-style.constants';
import type { HeroProps } from '../types/profile.types';

/** Claim on the left, evidence on the right. No typing effects, no particles. */
export function Hero(props: HeroProps): ReactElement {
  return (
    <div className={heroClasses.wrapper}>
      <div className={heroClasses.grid} aria-hidden />
      <div className={heroClasses.inner}>
        <div className={heroClasses.content}>
          <div className={heroClasses.coverFrame}>{props.cover}</div>
          <p className={heroClasses.eyebrow}>{props.eyebrow}</p>
          <h1 className={heroClasses.name}>{props.name}</h1>
          <p className={heroClasses.role}>{props.role}</p>
          <p className={heroClasses.tagline}>{props.tagline}</p>
          <p className={heroClasses.valueProp}>{props.valueProp}</p>
          <div className={heroClasses.actions}>
            {props.primaryAction}
            {props.secondaryAction}
            {props.tertiaryAction}
          </div>
          <div className={heroClasses.socialRow}>{props.socialLinks}</div>
        </div>
        <div className={heroClasses.aside}>{props.aside}</div>
      </div>
    </div>
  );
}
