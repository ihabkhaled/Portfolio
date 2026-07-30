# PWA and offline behavior

What "installable" actually means on this site, and exactly what the offline fallback does and
does not cover. There was no prior documentation for this module
(`src/modules/pwa/`) — this is the first.

## What's real

- **Installable manifest** (`src/app/manifest.ts`, served at `/manifest.webmanifest`): name,
  short name, icons (`public/icons/icon-192.png`, `icon-512.png`), `display: 'standalone'`,
  theme/background colors. `start_url` is `/en` — a visitor who installs from any locale still
  launches into English; there's no "remember my locale" mechanism for the install shortcut.
- **Service worker registration** (`src/modules/pwa/`): `ServiceWorkerRegistrationContainer`
  calls `useServiceWorkerRegistration`, which registers `/sw.js` once on mount. It is only
  rendered in production (`src/app/[locale]/layout.tsx` gates it on `appConfig.isProduction`) —
  there is no service worker in local dev, by design, so you never debug stale-cache issues
  while iterating.
- **The service worker itself** (`public/sw.js`, plain JS, not build-generated): on `install` it
  precaches the icons and one `/​<locale>/offline` page **per locale** (all 17). On `activate` it
  deletes any cache from a previous version. On `fetch`, it only intercepts top-level page
  navigations (`request.mode === 'navigate'`) to same-origin, non-API, non-`_next` URLs that
  match a known public path (`src/app/[locale]/offline/page.tsx` and its siblings) — RSC
  fetches, prefetches, and API calls pass straight through, untouched. When a matched navigation
  fails (no network), it serves the cached offline page **for the visitor's own locale**, falling
  back to English if the URL's locale segment isn't recognized.

## What's not real (yet)

**The offline fallback page's own copy overstates what the service worker does.**
`pwa.offlineDescription` (`src/packages/i18n/messages/*.json`) reads "Reconnect to continue.
Pages you have already visited remain available on this device" — but `public/sw.js` has no
runtime caching strategy for regular pages, only the precached `/offline` route itself.
A page you visited five minutes ago is **not** guaranteed to load without a network connection;
only the offline fallback page is guaranteed to. This is a real content/behavior mismatch, not
a documentation nuance — either the copy should be corrected to describe only what's precached,
or the service worker should gain an actual runtime-caching strategy (e.g. stale-while-revalidate
for visited navigations) to make the existing copy true. Whoever picks this up should update
`public/sw.js` and the `pwa.offlineDescription` key in **all 17** catalogs together, not one
without the other.

## Changing what's precached

Edit `PUBLIC_PATHS` and `PRECACHE_URLS` in `public/sw.js` directly — there's no build step
generating this file, so a change takes effect on next deploy with no other wiring. Bump
`CACHE_NAME` (`ihab-khaled-offline-v1` → `v2`) whenever you change what's precached, so the
`activate` handler actually evicts the old cache instead of visitors carrying it forward
indefinitely.

## Testing

- `src/tests/e2e/resume.e2e.ts` and friends don't test the service worker directly (Playwright's
  default context doesn't register service workers across test runs reliably). The offline
  fallback **page** itself is covered like any other route: `src/tests/accessibility/pages.a11y.ts`
  scans `/en/offline`, and `src/tests/e2e/seo.e2e.ts` asserts it's `noindex, nofollow` in every
  locale.
- There is currently no automated test that installs the service worker and simulates an offline
  navigation end-to-end. If you change `public/sw.js`, verify manually: build and start the
  production server, open the app, register the service worker (reload once), then use browser
  DevTools' "Offline" network throttling and navigate to a fresh URL to confirm the fallback
  page appears.
