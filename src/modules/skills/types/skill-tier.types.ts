import type { ReactNode } from 'react';

export interface SkillTierProps {
  readonly headingId: string;
  readonly name: string;
  readonly definition: string;
  readonly technologies: ReactNode;
}
