import type { ReactNode } from 'react';

import type { AppLocale } from '@/packages/i18n';

/** Stable identifier for a public professional link. */
export type ProfileLinkId = 'github' | 'linkedin' | 'email';

export interface ProfileLink {
  readonly id: ProfileLinkId;
  readonly href: string;
}

/**
 * A verified, high-level experience indicator. `years` feeds an ICU plural
 * message; indicators without a duration render a qualitative label instead.
 */
export interface ExperienceIndicator {
  readonly id: string;
  readonly years: number | null;
}

/**
 * Public profile facts. Deliberately excludes phone number, street address,
 * military status and nationality — see docs/content-guide.md.
 */
export interface PublicProfile {
  readonly displayName: string;
  readonly legalName: string;
  readonly githubLogin: string;
  readonly locationId: string;
  readonly email: string;
  readonly links: readonly ProfileLink[];
  readonly curriculumVitaePath: string;
  readonly portraitPath: string | null;
  readonly availabilityEnabled: boolean;
  readonly indicators: readonly ExperienceIndicator[];
}

export interface HomePageContainerProps {
  readonly locale: AppLocale;
}

export interface HeroProps {
  readonly eyebrow: string;
  readonly name: string;
  readonly role: string;
  readonly tagline: string;
  readonly valueProp: string;
  readonly primaryAction: ReactNode;
  readonly secondaryAction: ReactNode;
  readonly tertiaryAction: ReactNode;
  readonly socialLinks: ReactNode;
  readonly aside: ReactNode;
}
