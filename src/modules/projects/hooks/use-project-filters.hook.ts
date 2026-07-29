import { useMemo, useState } from 'react';

import { filterEntriesByCategory } from '../helpers/project-filter.helper';
import type {
  UseProjectFiltersInput,
  UseProjectFiltersResult,
} from '../types/project-filter.types';
import type { ProjectCategory } from '../types/projects.types';

/**
 * Client-side facet filtering over an already-localized, already-rendered
 * entry list. No refetch and no URL state — the whole catalog is small enough
 * to filter in the browser.
 */
export function useProjectFilters(input: UseProjectFiltersInput): UseProjectFiltersResult {
  const [active, setActive] = useState<ProjectCategory>('all');

  const chips = input.categories.map((category) => ({
    id: category,
    label: input.categoryLabels[category],
    isActive: category === active,
    onSelect: () => {
      setActive(category);
    },
  }));

  const visibleEntries = useMemo(
    () => filterEntriesByCategory(input.entries, active),
    [active, input.entries],
  );

  return { chips, visibleEntries };
}
