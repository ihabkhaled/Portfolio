import { describe, expect, it } from 'vitest';

import { mapRepoPayload } from '../mappers/github.mapper';
import { githubRepoSchema } from '../schemas/github.schema';

const basePayload = {
  name: 'ClawAI',
  description: 'Local-first AI orchestration.',
  html_url: 'https://github.com/ihabkhaled/ClawAI',
  homepage: 'https://claw-frontend-five.vercel.app',
  topics: ['ai', 'llm'],
  language: 'TypeScript',
  stargazers_count: 21,
  forks_count: 1,
  license: { spdx_id: 'Apache-2.0' },
  pushed_at: '2026-07-29T15:58:09Z',
  updated_at: '2026-07-28T10:00:00Z',
};

const parse = (overrides: Record<string, unknown> = {}) =>
  githubRepoSchema.parse({ ...basePayload, ...overrides });

describe('githubRepoSchema', () => {
  it('accepts a complete payload', () => {
    expect(() => parse()).not.toThrow();
  });

  it('accepts a sparse payload with null optional fields', () => {
    expect(() =>
      parse({
        description: null,
        homepage: null,
        topics: null,
        language: null,
        stargazers_count: null,
        forks_count: null,
        license: null,
        pushed_at: null,
      }),
    ).not.toThrow();
  });

  it('rejects a payload missing the required identity fields', () => {
    expect(() => githubRepoSchema.parse({ description: 'x' })).toThrow();
  });

  it('rejects negative counts', () => {
    expect(() => parse({ stargazers_count: -1 })).toThrow();
  });
});

describe('mapRepoPayload', () => {
  it('maps a complete payload to a snapshot', () => {
    expect(mapRepoPayload(parse())).toEqual({
      name: 'ClawAI',
      description: 'Local-first AI orchestration.',
      url: 'https://github.com/ihabkhaled/ClawAI',
      homepage: 'https://claw-frontend-five.vercel.app',
      topics: ['ai', 'llm'],
      primaryLanguage: 'TypeScript',
      stars: 21,
      forks: 1,
      license: 'Apache-2.0',
      lastActivityAt: '2026-07-29T15:58:09Z',
    });
  });

  it('suppresses zero counts so no meaningless metric is rendered', () => {
    const snapshot = mapRepoPayload(parse({ stargazers_count: 0, forks_count: 0 }));
    expect(snapshot.stars).toBeNull();
    expect(snapshot.forks).toBeNull();
  });

  it('treats blank strings as absent', () => {
    const snapshot = mapRepoPayload(parse({ description: ' '.repeat(3), homepage: '' }));
    expect(snapshot.description).toBeNull();
    expect(snapshot.homepage).toBeNull();
  });

  it('drops an unsafe or relative homepage', () => {
    // Built dynamically so lint fixers cannot "upgrade" the deliberate http URL.
    const insecureHomepage = ['http', '//insecure-host'].join(':');

    expect(mapRepoPayload(parse({ homepage: 'javascript:alert(1)' })).homepage).toBeNull();
    expect(mapRepoPayload(parse({ homepage: '/relative' })).homepage).toBeNull();
    expect(mapRepoPayload(parse({ homepage: insecureHomepage })).homepage).toBeNull();
  });

  it('drops an unidentified license', () => {
    expect(mapRepoPayload(parse({ license: { spdx_id: 'NOASSERTION' } })).license).toBeNull();
    expect(mapRepoPayload(parse({ license: null })).license).toBeNull();
  });

  it('falls back to updated_at when pushed_at is absent', () => {
    expect(mapRepoPayload(parse({ pushed_at: null })).lastActivityAt).toBe('2026-07-28T10:00:00Z');
  });

  it('reports no activity when both timestamps are absent', () => {
    expect(mapRepoPayload(parse({ pushed_at: null, updated_at: null })).lastActivityAt).toBeNull();
  });

  it('defaults missing topics to an empty list', () => {
    expect(mapRepoPayload(parse({ topics: null })).topics).toEqual([]);
  });
});
