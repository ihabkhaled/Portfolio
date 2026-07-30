# Translation guide

How the 17 locale catalogs are structured, what "parity" means and how it's enforced, and the
workflow for adding or changing translated copy. For the mechanics of adding a brand-new message
**key** (as opposed to translating existing ones), see
[skills/add-i18n-message-key.md](../skills/add-i18n-message-key.md) — that skill covers the
engineering task; this guide covers the content-authoring task, including the RTL and
case-study-prose concerns that skill doesn't get into.

## The locale set

`en ar fr it de hi fa th ja zh es pt ko tr ru id nl` — 17 locales, declared once in
`SUPPORTED_LOCALES` (`src/packages/i18n/locale.constants.ts`). `en` is `DEFAULT_LOCALE`. `ar`
and `fa` are the two RTL locales (`getLocaleDirection`); every other locale is LTR. Every page
URL is locale-prefixed (`/[locale]/...`); there is no un-prefixed default.

Adding an 18th locale means: add it to `SUPPORTED_LOCALES`, `LOCALE_NAMES`, and
`OPEN_GRAPH_LOCALES` (all three in `locale.constants.ts`), add it to `LOCALES` in `public/sw.js`,
add a full catalog file, add the social-card font triple under `src/shared/fonts/social/`, and
regenerate social images (`npm run assets:social:generate`). This is a bigger change than
translating existing copy — plan for it separately.

## Catalog structure

One JSON file per locale under `src/packages/i18n/messages/<locale>.json`, each with the
**identical key tree** — same namespaces, same nesting, same ICU placeholders (`{years}`,
`{count}`, plural forms) in every locale, only the string values differ. Namespaces
(`I18N_NAMESPACES`, `src/shared/i18n/i18n-namespaces.constants.ts`): `app`, `nav`, `home`,
`experience`, `projects`, `skills`, `about`, `resume`, `contact`, `github`, `errors`,
`notFound`, `errorPage`, `pwa`.

The `projects` namespace carries the heaviest translation load: `projects.items.<slug>.summary`
/ `.role` / `.overview` / `.architecture` / `.engineering` — full case-study prose, one full set
per project per locale, not just UI chrome. This is deliberate: a recruiter reading the site in
Arabic or Japanese should get the same depth as an English reader, not a translated nav with
English paragraphs underneath.

## Parity is enforced by a test, not a checklist

`src/tests/unit/i18n-catalog-parity.test.ts` runs against every locale in `SUPPORTED_LOCALES`
and fails the coverage gate if:

- A locale is missing a key the English catalog has, or has an extra one the English catalog
  doesn't (`sortKeys(localized)` must deep-equal `sortKeys(english)`).
- A key's ICU placeholders don't match between English and the locale (e.g. English has
  `{years}` but the translation dropped it or renamed it).
- A non-English locale's value is character-for-character identical to English for a string
  18+ characters long — this catches "translated" strings that are actually just the English
  copy left in place. (`app.title` and `app.seoTitle` are the two deliberate exceptions — a
  person's name and a product name are the same string in every language.)
- Any locale contains a `�` replacement character — a sign an encoding step corrupted the file.

If you add or edit a message key, `npm run test` (or `test:coverage`) tells you immediately
which locale(s) still need the change — you don't need to manually diff 17 files.

## Workflow: translating existing copy

1. Change the English (`en.json`) value first if the underlying copy is wrong or incomplete —
   every other locale is translated _from_ English, not independently authored.
2. Update the same key in all 16 other catalogs. Preserve every ICU placeholder exactly
   (`{years}`, `{count}`, `{variable, plural, one {…} other {…}}`) — the parity test checks this
   mechanically, but get it right the first time rather than relying on the test to catch it.
3. For `ar`/`fa`: translate the meaning, not the punctuation direction — next-intl and the
   browser handle RTL mirroring from `dir="rtl"` on `<html>` (set in
   `src/app/[locale]/layout.tsx` via `getLocaleDirection`); you don't add directional markers in
   the copy itself. Numbers, Latin technology names (`TypeScript`, `Next.js`), and email
   addresses stay LTR inline automatically via Unicode bidi rules — don't fight this by hand.
4. Run `npm run test` and fix whatever the parity test flags.
5. Spot-check visually: `npm run dev`, visit `/<locale>/<page>` for at least the locale you
   changed, and for `ar`/`fa` specifically check the page doesn't overflow horizontally at
   320–390px — RTL layouts are where mirroring bugs and long-translation overflow both surface
   first. `src/tests/visual/pages.visual.ts` has a standing `home-desktop-ar` baseline; add one
   for any other page where you're not confident the mirrored layout is correct.
6. `npm run gate:push` before committing.

## Workflow: adding a new project case study

Translated prose lives in `projects.items.<slug>.{summary,role,overview,architecture,engineering}`
— write the English version first, then produce all 16 translations before merging (a project
visible in some locales and silently falling back in others is exactly the inconsistency the
parity test exists to prevent). See [content-guide.md](./content-guide.md) for the non-copy side
of adding a project (the catalog entry, GitHub repo wiring, structured data).

## What "no fake numbers" means for translated copy

Skill/experience copy across every locale must stay defensible: grouped skill tiers, not
percentages; years-of-experience figures that match `PUBLIC_PROFILE.indicators`
(`src/modules/profile/constants/profile.constants.ts`) exactly, not a rounder-sounding number in
translation; "recently active" badges driven by real GitHub timestamps, never asserted in copy.
If a translated phrase would overstate something the English original didn't claim, fix the
translation to match the English meaning — don't let translation drift become scope creep.
