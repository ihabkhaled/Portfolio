# Localized Home Cover and English Root Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render each locale's social cover above the home-page name and serve English at `/` without redirecting while preserving `/en`.

**Architecture:** The server-rendered home container selects `/social/<locale>.png` and passes an optimized image node into the pure Hero component. A Next.js internal rewrite maps `/` to `/en`, preserving the root address bar while reusing the complete localized English route, layout, metadata, and canonical URL.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, next/image wrapper, next-intl, Vitest, Testing Library, Playwright.

## Global Constraints

- Preserve the generated 1200×630 cover without cropping.
- Select the cover from the URL locale with no client-side state.
- Keep `/`, `/en`, `/ar`, and every existing localized route reachable.
- Keep `/en` canonical and do not add `/` to the sitemap.
- Follow component/container boundaries and use `AppImage` rather than raw `next/image`.

---

### Task 1: Locale-specific framed hero cover

**Files:**

- Modify: `src/modules/profile/types/profile.types.ts`
- Modify: `src/modules/profile/components/hero.component.tsx`
- Modify: `src/modules/profile/containers/home-page.container.tsx`
- Modify: `src/modules/profile/constants/profile-style.constants.ts`
- Test: `src/tests/integration/home-page.integration.test.tsx`
- Test: `src/tests/e2e/home.e2e.ts`

**Interfaces:**

- Produces: `HeroProps.cover: ReactNode` rendered before the hero eyebrow and name.
- Consumes: `AppImage` with `src="/social/<locale>.png"`, dimensions 1200×630, localized alt text, responsive sizes, and priority loading.

- [ ] Add integration assertions that the English cover has `/social/en.png`, localized alt text, 1200×630 attributes, and precedes the `h1`; add E2E coverage that `/en` and `/ar` expose different localized image sources.
- [ ] Run `npm run test -- src/tests/integration/home-page.integration.test.tsx` and verify the new cover assertion fails.
- [ ] Add the `cover` prop, framed hero markup, logical responsive frame styles, and locale-derived `AppImage` composition.
- [ ] Run the focused integration test and confirm it passes.
- [ ] Run the focused home E2E tests and review English/Arabic screenshots.
- [ ] Commit with `feat(home): add localized framed hero cover`.

### Task 2: Non-redirecting English root

**Files:**

- Modify: `next.config.ts`
- Modify: `src/tests/e2e/i18n-rtl.e2e.ts`
- Modify: `src/tests/e2e/seo.e2e.ts`

**Interfaces:**

- Produces: a `beforeFiles` rewrite from `/` to `/en`.
- Preserves: browser URL `/`, English document content and direction, `/en` canonical metadata, localized navigation, and all existing `/en` and `/ar` routes.

- [ ] Replace the existing redirect expectation with E2E assertions that `/` returns English content, keeps `/` in the address bar, contains no redirect response, and declares `/en` canonical; retain direct `/en` and `/ar` assertions.
- [ ] Run the focused i18n/SEO E2E tests and verify the root expectation fails because the current route redirects.
- [ ] Add a `beforeFiles` rewrite in `next.config.ts` from `/` to `/en`; leave the localized route, sitemap, and canonical builders unchanged.
- [ ] Run the focused E2E tests and confirm all root/localized contracts pass.
- [ ] Commit with `feat(routing): render english at the bare root`.

### Task 3: Visual and release verification

**Files:**

- Modify intentionally changed home visual baselines under `src/tests/visual/pages.visual.ts-snapshots/` after review.

- [ ] Run the home visual tests, regenerate current-OS home baselines, and inspect every changed screenshot.
- [ ] Run `npm run gate:push`.
- [ ] Run `npm run test:e2e` and `npm run security:scan`.
- [ ] Commit reviewed baselines with `test(visual): refresh localized home hero baselines`.
- [ ] Push `main` and monitor all GitHub checks to completion.
