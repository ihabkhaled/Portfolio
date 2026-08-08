import { describe, expect, it } from 'vitest';

import { PROJECTS, RECENT_ACTIVITY_DAYS } from '../constants/projects.constants';
import {
  filterProjectsByCategory,
  findProjectBySlug,
  isRecentlyActive,
  listAvailableCategories,
  listCaseStudySlugs,
  selectFeaturedProjects,
  sortProjectsByPriority,
} from '../helpers/project-filter.helper';
import { PROJECT_CATEGORIES, type Project } from '../types/projects.types';

const buildProject = (overrides: Partial<Project>): Project => ({
  slug: 'sample',
  name: 'Sample',
  kind: 'open-source',
  categories: ['backend'],
  stack: ['Node.js'],
  links: { repository: null, live: null },
  repositoryName: null,
  priority: 1,
  featured: false,
  hasCaseStudy: false,
  fallbackUpdatedAt: null,
  ...overrides,
});

describe('filterProjectsByCategory', () => {
  it('returns every project for the all facet', () => {
    expect(filterProjectsByCategory(PROJECTS, 'all')).toHaveLength(PROJECTS.length);
  });

  it('keeps only projects carrying the requested category', () => {
    const security = filterProjectsByCategory(PROJECTS, 'security');
    expect(security.length).toBeGreaterThan(0);
    for (const project of security) {
      expect(project.categories).toContain('security');
    }
  });

  it('returns an empty list when nothing matches', () => {
    const projects = [buildProject({ categories: ['backend'] })];
    expect(filterProjectsByCategory(projects, 'mobile')).toEqual([]);
  });
});

describe('sortProjectsByPriority', () => {
  it('orders ascending by priority without mutating the input', () => {
    const input = [
      buildProject({ slug: 'b', priority: 5 }),
      buildProject({ slug: 'a', priority: 2 }),
    ];
    const sorted = sortProjectsByPriority(input);
    expect(sorted.map((project) => project.slug)).toEqual(['a', 'b']);
    expect(input[0]?.slug).toBe('b');
  });
});

describe('selectFeaturedProjects', () => {
  it('returns featured projects in priority order, bounded by the limit', () => {
    const featured = selectFeaturedProjects(PROJECTS, 5);
    expect(featured).toHaveLength(5);
    for (const project of featured) {
      expect(project.featured).toBe(true);
    }
    const priorities = featured.map((project) => project.priority);
    expect(priorities).toEqual([...priorities].toSorted((a, b) => a - b));
  });

  it('never returns more than the limit', () => {
    expect(selectFeaturedProjects(PROJECTS, 2)).toHaveLength(2);
  });
});

describe('listAvailableCategories', () => {
  it('always keeps all and drops facets with no matching project', () => {
    const projects = [buildProject({ categories: ['backend'] })];
    expect(listAvailableCategories(projects, PROJECT_CATEGORIES)).toEqual(['all', 'backend']);
  });

  it('keeps every populated facet of the real catalog', () => {
    const available = listAvailableCategories(PROJECTS, PROJECT_CATEGORIES);
    expect(available).toContain('all');
    expect(available).toContain('ai');
    expect(available).toContain('security');
  });
});

describe('isRecentlyActive', () => {
  const now = new Date('2026-07-29T00:00:00.000Z');

  it('is true inside the activity window', () => {
    expect(isRecentlyActive('2026-07-20T00:00:00.000Z', now)).toBe(true);
  });

  it('is false beyond the activity window', () => {
    expect(isRecentlyActive('2025-01-01T00:00:00.000Z', now)).toBe(false);
  });

  it('is false at exactly one day past the window and true on the boundary', () => {
    const boundary = new Date(now.getTime() - RECENT_ACTIVITY_DAYS * 86_400_000).toISOString();
    expect(isRecentlyActive(boundary, now)).toBe(true);
    const justOutside = new Date(now.getTime() - (RECENT_ACTIVITY_DAYS + 1) * 86_400_000);
    expect(isRecentlyActive(justOutside.toISOString(), now)).toBe(false);
  });

  it('never claims recency for unknown, invalid or future timestamps', () => {
    expect(isRecentlyActive(null, now)).toBe(false);
    expect(isRecentlyActive('not-a-date', now)).toBe(false);
    expect(isRecentlyActive('2027-01-01T00:00:00.000Z', now)).toBe(false);
  });

  it('honours a custom window', () => {
    expect(isRecentlyActive('2026-07-20T00:00:00.000Z', now, 3)).toBe(false);
  });
});

describe('findProjectBySlug', () => {
  it('finds a known project', () => {
    expect(findProjectBySlug(PROJECTS, 'clawai')?.name).toBe('ClawAI');
  });

  it('returns undefined for an unknown slug', () => {
    expect(findProjectBySlug(PROJECTS, 'missing')).toBeUndefined();
  });
});

describe('listCaseStudySlugs', () => {
  it('lists case-study slugs in priority order', () => {
    expect(listCaseStudySlugs(PROJECTS)).toEqual([
      'clawai',
      'auraspear',
      'foodorder',
      'twinzyai',
      'nextranger',
      'myoncare',
      'garment-io',
      'tarsyaa',
      'ovarc',
      'callrater',
      'vms',
      'health-integrations',
      'payment-integrations',
    ]);
  });
});

describe('project catalog integrity', () => {
  it('uses unique slugs and priorities', () => {
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(PROJECTS.length);
    expect(new Set(PROJECTS.map((p) => p.priority)).size).toBe(PROJECTS.length);
  });

  it('never exposes a repository link for employer-owned work', () => {
    const professionalProjects = PROJECTS.filter((p) => p.kind === 'professional');
    for (const project of professionalProjects) {
      expect(project.links.repository).toBeNull();
      expect(project.repositoryName).toBeNull();
    }
  });

  it('only tracks GitHub metadata for open-source projects', () => {
    const projectsWithRepo = PROJECTS.filter((p) => p.repositoryName !== null);
    for (const project of projectsWithRepo) {
      expect(project.kind).toBe('open-source');
    }
  });
});
