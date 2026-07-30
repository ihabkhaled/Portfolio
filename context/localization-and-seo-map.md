# Localization and SEO map

Load this page for routes, copy, metadata, PWA, or crawler work.

## Sources of truth

| Contract                                                                      | Source                                                                                     |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Locale codes, names, Open Graph locales, direction                            | `src/packages/i18n/locale.constants.ts`                                                    |
| Locale-preserving URLs                                                        | `src/shared/helpers/localized-route.helper.ts`                                             |
| App paths                                                                     | `src/shared/constants/route-paths.constants.ts`                                            |
| Public/private crawl paths and social size                                    | `src/shared/constants/seo.constants.ts`                                                    |
| Metadata, canonical, hreflang, social cards                                   | `src/shared/helpers/seo-metadata.helper.ts`, `src/shared/helpers/route-metadata.helper.ts` |
| JSON-LD structured data (Person, WebSite, BreadcrumbList, SoftwareSourceCode) | `src/shared/helpers/structured-data.helper.ts`                                             |
| Sitemap, robots, manifest                                                     | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`                           |

Every page URL starts with one of the 17 `SUPPORTED_LOCALES` (`en ar fr it de hi fa th ja zh es
pt ko tr ru id nl`). Arabic and Persian are RTL. Seven indexable paths (`INDEXABLE_PATHS`: home,
experience, projects, skills, about, resume, contact) × 17 locales produce 119 sitemap
documents; the dynamic `/projects/[slug]` case studies are intentionally not in the sitemap
individually — they're reachable from the (indexed) projects listing. Only the PWA `offline`
fallback and `/api/*` routes are non-indexable.

## Public-page change

1. Add the locale-free path to `ROUTE_PATHS` and `INDEXABLE_PATHS`
   (`src/shared/constants/route-paths.constants.ts`, `src/shared/constants/seo.constants.ts`).
2. Add the page under `src/app/[locale]/<path>/page.tsx` (only the home route lives inside a
   `(public)/` route group; every other page is a direct locale child).
3. Add every message key to **all 17** files in `src/packages/i18n/messages/`.
4. Build metadata with `buildRouteMetadata` (wraps `buildSeoMetadata`); add JSON-LD via
   `structured-data.helper.ts` builders when the page warrants it (see how
   `src/app/[locale]/layout.tsx` wires Person/WebSite and
   `src/app/[locale]/projects/[slug]/page.tsx` wires BreadcrumbList/SoftwareSourceCode).
5. Update navigation (`src/modules/site-navigation/constants/site-navigation.constants.ts`), the
   sitemap/robots e2e assertions, and add a route to the accessibility/visual suites.
6. If social copy changed, run `npm run assets:social:generate` and review all changed PNGs.

Run `npm run assets:social:check` for deterministic asset drift, then the focused unit/e2e tests.
Use `npm run gate:push` before publication.
