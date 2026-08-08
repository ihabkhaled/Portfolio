import type { ReactNode } from 'react';

import type { AppLocale } from '@/packages/i18n';

/**
 * Employment is a role at a company; independent work is Ihab's own practice.
 * They are modelled separately so overlapping date ranges never read as two
 * simultaneous employers.
 */
export type EngagementKind = 'employment' | 'independent';

export interface ExperienceRole {
  /**
  Message-catalog key under `experience.roles`.
  */
  readonly id: string;
  /**
  Organisation name — never translated.
  */
  readonly organisation: string;
  /**
  Job title — never translated, it is a proper noun on a CV.
  */
  readonly title: string;
  readonly kind: EngagementKind;
  /**
  ISO year-month.
  */
  readonly startedAt: string;
  /**
  ISO year-month, or null when the role is current.
  */
  readonly endedAt: string | null;
  readonly locationId: string;
  readonly website: string | null;
  readonly stack: readonly string[];
  /**
  Message keys under `experience.roles.<id>.highlights`.
  */
  readonly highlightKeys: readonly string[];
}

export interface ExperienceRoleCardProperties {
  readonly organisation: string;
  readonly title: string;
  readonly dateRange: string;
  readonly summary: string;
  readonly highlights: ReactNode;
  readonly stack: ReactNode;
  readonly websiteLink: ReactNode;
}

export interface ExperienceRoleGroupProperties {
  readonly title: string;
  readonly roles: ReactNode;
}

export interface ExperiencePageContainerProperties {
  readonly locale: AppLocale;
}
