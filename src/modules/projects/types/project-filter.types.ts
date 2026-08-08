import type { ReactNode } from 'react';

import type { AppLocale } from '@/packages/i18n';

import type { ProjectCategory } from './projects.types';

/**
One project row, tagged with its categories so it can be filtered client-side.
*/
export interface ProjectListEntry {
  readonly slug: string;
  readonly categories: readonly ProjectCategory[];
  readonly node: ReactNode;
}

export interface ProjectFilterChipViewModel {
  readonly id: ProjectCategory;
  readonly label: string;
  readonly isActive: boolean;
  readonly onSelect: () => void;
}

export interface ProjectFilterBarProperties {
  readonly label: string;
  /**
  Pre-rendered `ProjectFilterChip` elements — the caller owns the `.map()`.
  */
  readonly chips: ReactNode;
}

export interface UseProjectFiltersInput {
  readonly entries: readonly ProjectListEntry[];
  readonly categories: readonly ProjectCategory[];
  readonly categoryLabels: Readonly<Record<ProjectCategory, string>>;
}

export interface UseProjectFiltersResult {
  readonly chips: readonly ProjectFilterChipViewModel[];
  readonly visibleEntries: readonly ProjectListEntry[];
}

export interface ProjectsFilterContainerProperties {
  readonly entries: readonly ProjectListEntry[];
  readonly categories: readonly ProjectCategory[];
  readonly categoryLabels: Readonly<Record<ProjectCategory, string>>;
  readonly filtersLabel: string;
  readonly emptyLabel: string;
}

export interface ProjectsPageContainerProperties {
  readonly locale: AppLocale;
}
