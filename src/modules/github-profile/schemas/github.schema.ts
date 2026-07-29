import { z } from '@/packages/zod';

/**
 * Only the fields the portfolio actually renders are modelled. Everything is
 * nullable/optional because a public API is not a contract we control — an
 * unexpected shape must degrade to the static fallback, never throw into a page.
 */
export const githubRepositorySchema = z.object({
  name: z.string().min(1),
  description: z.string().nullish(),
  html_url: z.string().min(1),
  homepage: z.string().nullish(),
  topics: z.array(z.string()).nullish(),
  language: z.string().nullish(),
  stargazers_count: z.number().int().nonnegative().nullish(),
  forks_count: z.number().int().nonnegative().nullish(),
  license: z.object({ spdx_id: z.string().nullish() }).nullish(),
  pushed_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export type GithubRepositoryPayload = z.infer<typeof githubRepositorySchema>;
