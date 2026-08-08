import type { ReactElement } from 'react';

import { cn } from '@/packages/ui-primitives';

import { projectFilterClasses } from '../constants/projects-style.constants';
import type {
  ProjectFilterBarProperties,
  ProjectFilterChipViewModel,
} from '../types/project-filter.types';

export function ProjectFilterChip(properties: ProjectFilterChipViewModel): ReactElement {
  return (
    <button
      type="button"
      className={cn(
        projectFilterClasses.chip,
        properties.isActive && projectFilterClasses.chipActive,
      )}
      aria-pressed={properties.isActive}
      onClick={properties.onSelect}
    >
      {properties.label}
    </button>
  );
}

/**
Chips are pre-rendered `ProjectFilterChip` elements; the caller owns the `.map()`.
*/
export function ProjectFilterBar(properties: ProjectFilterBarProperties): ReactElement {
  return (
    <div className={projectFilterClasses.bar} role="group" aria-label={properties.label}>
      {properties.chips}
    </div>
  );
}
