import { describe, expect, it } from 'vitest';

import type { RepoSnapshot } from '@/modules/github-profile';

import { buildRepoMetricLabels } from '../helpers/project-metrics.helper';

function buildSnapshot(overrides: Readonly<Partial<RepoSnapshot>> = {}): RepoSnapshot {
  return {
    name: 'ClawAI',
    description: null,
    url: 'https://github.com/ihabkhaled/ClawAI',
    homepage: null,
    topics: [],
    primaryLanguage: null,
    stars: null,
    forks: null,
    license: null,
    lastActivityAt: null,
    ...overrides,
  };
}

describe('buildRepoMetricLabels', () => {
  it('returns an empty list when the snapshot is undefined', () => {
    expect(buildRepoMetricLabels(undefined, (count) => `${count} stars`)).toEqual([]);
  });

  it('includes only the fields present on the snapshot', () => {
    const snapshot = buildSnapshot({ primaryLanguage: 'TypeScript', license: 'Apache-2.0' });

    expect(buildRepoMetricLabels(snapshot, (count) => `${count} stars`)).toEqual([
      'TypeScript',
      'Apache-2.0',
    ]);
  });

  it('formats the star count through the translator and omits a null count', () => {
    const snapshot = buildSnapshot({ stars: 21 });

    expect(buildRepoMetricLabels(snapshot, (count) => `${count} stars`)).toEqual(['21 stars']);
  });

  it('returns every field when the snapshot is fully populated', () => {
    const snapshot = buildSnapshot({
      primaryLanguage: 'TypeScript',
      stars: 21,
      license: 'Apache-2.0',
    });

    expect(buildRepoMetricLabels(snapshot, (count) => `${count} stars`)).toEqual([
      'TypeScript',
      '21 stars',
      'Apache-2.0',
    ]);
  });
});
