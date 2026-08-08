import type { ReactNode } from 'react';

export interface SkillTierProperties {
  readonly headingId: string;
  readonly name: string;
  readonly definition: string;
  readonly technologies: ReactNode;
}
