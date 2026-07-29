import { MILLISECONDS_PER_DAY, RECENT_ACTIVITY_DAYS } from '../constants/projects.constants';
import type { ProjectListEntry } from '../types/project-filter.types';
import type { Project, ProjectCategory } from '../types/projects.types';

/**
 * Filters by facet. `all` is the identity filter, so the index renders the
 * complete catalog without a special case at the call site.
 */
export function filterProjectsByCategory(
  projects: readonly Project[],
  category: ProjectCategory,
): readonly Project[] {
  if (category === 'all') return projects;
  return projects.filter((project) => project.categories.includes(category));
}

/** Same facet rule as {@link filterProjectsByCategory}, applied to rendered entries. */
export function filterEntriesByCategory(
  entries: readonly ProjectListEntry[],
  category: ProjectCategory,
): readonly ProjectListEntry[] {
  if (category === 'all') return entries;
  return entries.filter((entry) => entry.categories.includes(category));
}

/** Editorial priority wins; star counts never influence ordering. */
export function sortProjectsByPriority(projects: readonly Project[]): readonly Project[] {
  return [...projects].toSorted((left, right) => left.priority - right.priority);
}

/** The home page shows a bounded set of featured work. */
export function selectFeaturedProjects(
  projects: readonly Project[],
  limit: number,
): readonly Project[] {
  return sortProjectsByPriority(projects.filter((project) => project.featured)).slice(0, limit);
}

/** Only facets that actually match a project are offered as filters. */
export function listAvailableCategories(
  projects: readonly Project[],
  candidates: readonly ProjectCategory[],
): readonly ProjectCategory[] {
  return candidates.filter(
    (category) => category === 'all' || filterProjectsByCategory(projects, category).length > 0,
  );
}

/**
 * A repository counts as recently active only when its last push is within the
 * threshold. Unknown or future-dated timestamps are never "recent", so the
 * badge cannot make a claim the data does not support.
 */
export function isRecentlyActive(
  lastActivityIso: string | null,
  now: Date,
  windowDays: number = RECENT_ACTIVITY_DAYS,
): boolean {
  if (lastActivityIso === null) return false;
  const lastActivity = new Date(lastActivityIso).getTime();
  if (Number.isNaN(lastActivity)) return false;
  const elapsed = now.getTime() - lastActivity;
  if (elapsed < 0) return false;
  return elapsed <= windowDays * MILLISECONDS_PER_DAY;
}

/** Finds one project by its stable slug. */
export function findProjectBySlug(projects: readonly Project[], slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Slugs that get a generated case-study route. */
export function listCaseStudySlugs(projects: readonly Project[]): readonly string[] {
  return sortProjectsByPriority(projects.filter((project) => project.hasCaseStudy)).map(
    (project) => project.slug,
  );
}
