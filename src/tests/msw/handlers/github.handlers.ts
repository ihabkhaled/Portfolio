import { http, HttpResponse } from 'msw';

import { GITHUB_API_ORIGIN } from '@/modules/github-profile';

/** A payload shaped like a real GitHub repository response. */
export function buildGithubRepositoryPayload(
  overrides: Readonly<Record<string, unknown>> = {},
): Record<string, unknown> {
  return {
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
    updated_at: '2026-07-29T15:58:09Z',
    ...overrides,
  };
}

export const githubHandlers = [
  http.get(`${GITHUB_API_ORIGIN}/repos/:owner/:repository`, ({ params }) =>
    HttpResponse.json(buildGithubRepositoryPayload({ name: params['repository'] })),
  ),
];
