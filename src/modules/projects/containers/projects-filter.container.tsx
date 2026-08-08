'use client';
// client-boundary-reason: holds the active filter facet as interactive UI state.

import type { ReactElement } from 'react';

import { ProjectFilterBar, ProjectFilterChip } from '../components/project-filter-bar.component';
import { projectFilterClasses, projectRowClasses } from '../constants/projects-style.constants';
import { useProjectFilters } from '../hooks/use-project-filters.hook';
import type { ProjectsFilterContainerProperties } from '../types/project-filter.types';

export function ProjectsFilterContainer(
  properties: ProjectsFilterContainerProperties,
): ReactElement {
  const { chips, visibleEntries } = useProjectFilters({
    entries: properties.entries,
    categories: properties.categories,
    categoryLabels: properties.categoryLabels,
  });

  return (
    <>
      <ProjectFilterBar
        label={properties.filtersLabel}
        chips={chips.map((chip) => (
          <ProjectFilterChip key={chip.id} {...chip} />
        ))}
      />
      {visibleEntries.length === 0 ? (
        <p className={projectFilterClasses.empty}>{properties.emptyLabel}</p>
      ) : (
        <ul className={projectRowClasses.list}>{visibleEntries.map((entry) => entry.node)}</ul>
      )}
    </>
  );
}
