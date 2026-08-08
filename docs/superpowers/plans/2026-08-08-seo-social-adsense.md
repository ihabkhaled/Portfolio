# SEO, Social Preview, and AdSense Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish portrait-led localized social previews, complete crawler discovery, and static Google AdSense verification.

**Architecture:** Extend the existing shared SEO contracts and deterministic social-image pipeline. Keep App Router files thin: constants own AdSense values, metadata helpers own search directives, `robots.ts`/`sitemap.ts` own discovery documents, and the locale layout composes the nonce-bearing script.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Playwright, deterministic Playwright image generation.

## Global Constraints

- Use `ca-pub-2415314275784926` and `google.com, pub-2415314275784926, DIRECT, f08c47fec0942fa0` as static source values.
- Preserve all 17 localized metadata and sitemap variants.
- Allow all crawlers to access public documents and `/ads.txt`; disallow only APIs and localized offline routes.
- Keep nonce-based CSP and never add `unsafe-inline` to `script-src`.
- Generate 1200 × 630 PNG previews from the supplied landscape portrait card without distorting
  the photo or altering its text.

---

### Task 1: AdSense discovery contract

**Files:**

- Create: `src/shared/constants/adsense.constants.ts`
- Create: `public/ads.txt`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/proxy.ts`
- Test: `src/tests/unit/seo-pwa-contract.test.ts`

**Interfaces:**

- Produces: `ADSENSE_ACCOUNT`, `ADSENSE_CLIENT`, and `ADSENSE_SCRIPT_URL` string constants.
- Consumes: the existing request nonce returned by `getRequestNonce()`.

- [ ] Add failing tests that read `public/ads.txt`, render the layout contract, and assert the exact account meta value and script URL/client/cross-origin attributes.
- [ ] Run `npm run test -- src/tests/unit/seo-pwa-contract.test.ts` and confirm failure because AdSense artifacts are absent.
- [ ] Add the exact one-line `ads.txt`, static constants, metadata `other.google-adsense-account`, and a nonce-bearing `next/script` with `strategy="afterInteractive"`, `async`, client query, and anonymous cross-origin.
- [ ] Extend CSP only with the explicit Google AdSense origins required for script/connect/image/frame traffic while retaining the nonce and strict-dynamic directives.
- [ ] Run the focused unit test and confirm it passes.
- [ ] Commit with `feat(seo): add static adsense discovery`.

### Task 2: Complete crawler and sitemap contracts

**Files:**

- Modify: `src/shared/helpers/seo-metadata.helper.ts`
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Test: `src/tests/unit/seo-pwa-contract.test.ts`
- Test: `src/tests/e2e/seo.e2e.ts`

**Interfaces:**

- Produces: indexable metadata with `googleBot` preview permissions; a robots response whose wildcard rule allows `/`, `/ads.txt`, `/sitemap.xml`, and `/social/`; sitemap entries for every `INDEXABLE_PATHS` and case-study path across `SUPPORTED_LOCALES`.

- [ ] Add failing unit/E2E assertions for explicit public crawl allowances, `/ads.txt`, Googlebot preview directives, and literal per-locale sitemap coverage for every public and case-study path.
- [ ] Run the focused unit test and confirm the new assertions fail.
- [ ] Expand the metadata and robots return values; retain `/api/` and every localized offline route as the only disallowed paths.
- [ ] Keep the sitemap source sets exhaustive and make tests enumerate every expected localized URL independently.
- [ ] Run the focused unit test and confirm it passes.
- [ ] Commit with `feat(seo): strengthen crawler discovery contracts`.

### Task 3: Portrait-led localized social cards

**Files:**

- Create: `support/assets/ihab-social-card.jpg`
- Modify: `support/social-images.mjs`
- Modify: `src/shared/helpers/seo-metadata.helper.ts`
- Modify: `public/social/*.png`
- Modify: `public/social/manifest.json`
- Test: `src/tests/unit/seo-pwa-contract.test.ts`
- Test: `src/tests/e2e/seo.e2e.ts`

**Interfaces:**

- Consumes: the supplied landscape card at `C:/Users/Ihab/OneDrive/Desktop/Images/c4a0fb19-eaeb-485d-9208-6d69e05b46b6.jpg`.
- Produces: deterministic 1200 × 630 localized PNG cards and metadata declaring `type: image/png`, width 1200, and height 630.

- [ ] Add failing metadata tests for PNG MIME type and E2E assertions for 1200 × 630 response-backed images.
- [ ] Run the focused unit test and confirm failure because image type is absent.
- [ ] Copy the supplied image into the generator-owned assets directory and include its hash in generator invalidation.
- [ ] Render the supplied card with a centered, proportion-preserving cover crop while retaining
      all important portrait and text content.
- [ ] Add image MIME type to Open Graph metadata and regenerate all locale cards with `npm run assets:social:generate`.
- [ ] Inspect the English card visually and run `npm run assets:social:check` plus focused tests.
- [ ] Commit with `feat(seo): add portrait-led localized social cards`.

### Task 4: Full validation

**Files:**

- Verify all files changed by Tasks 1–3.

- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck` and `npm run typecheck:compat`.
- [ ] Run `npm run test:coverage`.
- [ ] Run `npm run assets:social:check`.
- [ ] Run `npm run build`.
- [ ] Run the SEO Playwright suite when the local browser is available.
- [ ] Inspect `git diff --check` and `git status --short`, then report exact results and any environment-limited checks.
