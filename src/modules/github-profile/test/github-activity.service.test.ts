import { describe, expect, it, vi } from 'vitest';

import { http, HttpResponse } from '@/tests/msw/handler-tools';
import { buildGithubRepositoryPayload } from '@/tests/msw/handlers/github.handlers';
import { mswServer } from '@/tests/msw/server';

import { GITHUB_API_ORIGIN } from '../constants/github.constants';
import {
  buildRepositoryActivityReport,
  indexSnapshotsByName,
} from '../services/github-activity.service';
import type { RepositorySnapshot } from '../types/github.types';

function buildSnapshot(overrides: Readonly<Partial<RepositorySnapshot>> = {}): RepositorySnapshot {
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

describe('buildRepositoryActivityReport', () => {
  it('reports not degraded when every repository resolves', async () => {
    const report = await buildRepositoryActivityReport(['ClawAI', 'auraspear-platform']);

    expect(report.degraded).toBe(false);
    expect(report.repositories.map((snapshot) => snapshot.name)).toEqual([
      'ClawAI',
      'auraspear-platform',
    ]);
  });

  it('reports degraded and drops failed lookups when a repository cannot be fetched', async () => {
    mswServer.use(
      http.get(`${GITHUB_API_ORIGIN}/repos/:owner/:repository`, ({ params }) => {
        if (params['repository'] === 'auraspear-platform') {
          return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
        }
        return HttpResponse.json(buildGithubRepositoryPayload({ name: params['repository'] }));
      }),
    );
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const report = await buildRepositoryActivityReport(['ClawAI', 'auraspear-platform']);

    expect(report.degraded).toBe(true);
    expect(report.repositories.map((snapshot) => snapshot.name)).toEqual(['ClawAI']);
  });

  it('returns an empty, non-degraded report for an empty input', async () => {
    const report = await buildRepositoryActivityReport([]);

    expect(report).toEqual({ repositories: [], degraded: false });
  });
});

describe('indexSnapshotsByName', () => {
  it('indexes snapshots by repository name', () => {
    const snapshots = [buildSnapshot({ name: 'ClawAI' }), buildSnapshot({ name: 'TwinzyAI' })];

    const index = indexSnapshotsByName(snapshots);

    expect(index.get('ClawAI')).toBe(snapshots[0]);
    expect(index.get('TwinzyAI')).toBe(snapshots[1]);
    expect(index.get('missing')).toBeUndefined();
  });

  it('returns an empty map for no snapshots', () => {
    expect(indexSnapshotsByName([]).size).toBe(0);
  });
});
