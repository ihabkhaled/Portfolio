# GitHub integration

How live repository data reaches the projects pages, and exactly how it degrades when GitHub
doesn't cooperate. There was no prior documentation for `src/modules/github-profile/` — this is
the first. Full call chain with real code excerpts: [context/reference-patterns.md](../context/reference-patterns.md) §3.

## What it does

The home page's featured projects, the projects listing, and each case study enrich a static
project catalog (`src/modules/projects/constants/projects.constants.ts`) with live data for the
subset of projects that have a public GitHub repository: primary language, star/fork counts,
license, and last-activity timestamp (used to render a "recently active" badge — see
`RECENT_ACTIVITY_DAYS` in `src/modules/projects/constants/projects.constants.ts`).

- **Which repos**: `CURATED_REPOSITORY_NAMES`, derived automatically from every project in the
  catalog that has a `repositoryName` set — there's no separate list to keep in sync.
- **Which account**: `GITHUB_OWNER = 'ihabkhaled'` (`src/modules/github-profile/constants/github.constants.ts`).
- **Auth**: `GITHUB_TOKEN` is optional (`.env.example`). Unauthenticated requests to GitHub's
  REST API are rate-limited to 60/hour per IP; a token (even a fine-grained one with **no**
  scopes — this only ever reads public metadata) raises that to 5,000/hour. In development
  without a token, expect to see `403`/`429` rejections logged frequently — that's expected, not
  a bug, and every one of them degrades gracefully (see below).
- **Caching**: each repository fetch sets `next: { revalidate: 3600 }` (`GITHUB_REVALIDATE_SECONDS`)
  — Next.js's Data Cache serves the last good response for up to an hour before refetching, so a
  visitor's page render is never blocked on a fresh GitHub round trip.
- **Timeout**: `GITHUB_REQUEST_TIMEOUT_MS = 4000` via `AbortSignal.timeout`. A slow third party
  can add at most 4 seconds to a page render, never hold it open indefinitely.

## How it fails safely

`fetchRepositorySnapshot` (the gateway) never throws. A non-200 response, a payload that fails
`githubRepositorySchema` validation, a timeout, or a network error are all logged
(`appLogger.warn`, never `error` — this is expected-and-handled, not an incident) and mapped to
`null`. `buildRepositoryActivityReport` (the service) fans out every curated repository's fetch
concurrently with `Promise.all`, filters out the `null`s, and reports whether the result set is
`degraded` (fewer snapshots than repositories requested).

**The page never knows which repository failed or why.** Every project card and case study
already has static fallback values — a `fallbackUpdatedAt` date in the catalog, and copy that
doesn't depend on live stats — so a missing snapshot for one repository just means that one
card renders with static data while its siblings show live data. Nothing on the page can go
blank, throw, or block on GitHub's account. This is the single most load-bearing design decision
in this module: it's why `github.gateway.ts` swallows every failure instead of propagating an
`HttpError` the way `contact.gateway.ts` does for the same-origin contact form — a third party's
outage is not this site's incident.

## Testing this without hitting the real API

`src/tests/msw/handlers/github.handlers.ts` (registered in `src/tests/msw/server.ts`) intercepts
`api.github.com` requests in every Vitest run — unit and integration tests never make a real
network call. `src/modules/github-profile/test/github-activity.service.test.ts` specifically
tests the network boundary via MSW response overrides (403, malformed payload, timeout) rather
than mocking `fetchRepositorySnapshot` itself — see
[memory/testing-strategy.md](../memory/testing-strategy.md) for why that distinction matters
here (a gateway-level mock passed in an earlier version of this suite while silently never being
invoked, and the tests still passed by coincidence against the real network path).

In Playwright's e2e/visual suites there's no MSW (it only intercepts inside the Vitest process,
not a separately-spawned `next start` server), so `playwright.config.ts`'s `webServer.env` sets
`SERVER_API_MOCKING=enabled` instead. `fetchRepositorySnapshot` checks `apiMocking` first and
returns `null` immediately when it's `'enabled'`, before attempting any network call — every
Playwright run therefore renders 100% static fallback data, deterministically, regardless of
GitHub's actual rate-limit state at that moment. This was a real bug once: the first version of
the visual suite let real (rate-limited-or-not) GitHub responses through, and the "recently
active" badge's presence — which depends on live timestamps — silently shifted page height by a
few pixels between runs, failing `toHaveScreenshot` intermittently for reasons that had nothing
to do with the UI. `SERVER_API_MOCKING` must stay `disabled` everywhere else (it's the schema
default — see `src/packages/env/server.ts`) or the live GitHub feature silently stops working.

## Changing what's displayed

Add or remove a `repositoryName` on a project in `projects.constants.ts` — `CURATED_REPOSITORY_NAMES`
picks it up automatically, no other file to edit. To display a new field from GitHub's response,
extend `githubRepositorySchema` (only fields the app actually renders are modelled — see the
comment in `src/modules/github-profile/schemas/github.schema.ts` for why), add the mapping in
`github.mapper.ts`, and thread the new field through `RepositorySnapshot`
(`src/modules/github-profile/types/github.types.ts`).
