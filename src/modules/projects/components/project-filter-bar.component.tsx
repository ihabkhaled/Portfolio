import type { ReactElement } from 'react';

import { cn } from '@/packages/ui-primitives';

import { projectFilterClasses } from '../constants/projects-style.constants';
import type {
  ProjectFilterBarProps,
  ProjectFilterChipViewModel,
} from '../types/project-filter.types';

export function ProjectFilterChip(props: ProjectFilterChipViewModel): ReactElement {
  return (
    <button
      type="button"
      className={cn(projectFilterClasses.chip, props.isActive && projectFilterClasses.chipActive)}
      aria-pressed={props.isActive}
      onClick={props.onSelect}
    >
      {props.label}
    </button>
  );
}

/** Chips are pre-rendered `ProjectFilterChip` elements; the caller owns the `.map()`. */
export function ProjectFilterBar(props: ProjectFilterBarProps): ReactElement {
  return (
    <div className={projectFilterClasses.bar} role="group" aria-label={props.label}>
      {props.chips}
    </div>
  );
}
