import type { Route } from 'next';
import type { ReactNode } from 'react';

/** Filter facets shown on the projects index. `all` is the default facet. */
export const PROJECT_CATEGORIES = [
  'all',
  'ai',
  'backend',
  'fullstack',
  'mobile',
  'security',
  'healthcare',
  'platforms',
  'integrations',
  'opensource',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/**
 * Whether the source is publicly readable. Employer-owned systems are
 * `professional`: they never link to a repository and never imply open source.
 */
export type ProjectKind = 'open-source' | 'professional';

export interface ProjectLinks {
  /** Public repository, only for open-source work. */
  readonly repository: string | null;
  /** Live deployment, only when the URL has been verified to respond. */
  readonly live: string | null;
}

export interface Project {
  readonly slug: string;
  /** Product name — never translated. */
  readonly name: string;
  readonly kind: ProjectKind;
  readonly categories: readonly ProjectCategory[];
  /** Technology tokens rendered verbatim in every locale. */
  readonly stack: readonly string[];
  readonly links: ProjectLinks;
  /** Curated GitHub repository name, when one is tracked for live metadata. */
  readonly repositoryName: string | null;
  /** Lower sorts first. Editorial priority, never star count. */
  readonly priority: number;
  /** Featured on the home page. */
  readonly featured: boolean;
  /** Has a full case-study page. */
  readonly hasCaseStudy: boolean;
  /** ISO date of last known activity, used when GitHub data is unavailable. */
  readonly fallbackUpdatedAt: string | null;
}

export interface ProjectRowProps {
  readonly name: string;
  readonly summary: string;
  readonly role: string;
  readonly kindLabel: string;
  readonly isOpenSource: boolean;
  readonly isRecentlyActive: boolean;
  readonly recentlyActiveLabel: string;
  readonly stack: ReactNode;
  readonly metrics: ReactNode;
  readonly caseStudyHref: Route | null;
  readonly caseStudyLabel: string | null;
}
