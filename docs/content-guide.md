# Content update guide

How to update what's actually _on_ the site — a job, a project, a skill, the resume, the CV PDF
— as a content operation distinct from an engineering change. Everything in
[skills/](../skills/README.md) and [docs/features/](./features/README.md) is about adding
_code_; nothing existed before this file for "I just want to add a job I started this month."
Translated copy specifically is covered in more depth by
[translation-guide.md](./translation-guide.md) — this guide is about which structural files to
touch and in what order; that one is about producing the 17 translations once you know what to
write.

Every content change should still end with `npm run gate:push` (coverage, dead-code, and the
i18n parity test all run there) before you commit.

## Add or update a job (experience)

1. **Structural facts** — `src/modules/experience/constants/experience.constants.ts`:
   add an entry to `EXPERIENCE_ROLES` (id, organisation, title, `kind: 'employment' |
'independent'`, `startedAt`/`endedAt` as `'YYYY-MM'` or `null` for present, `locationId`,
   `website`, `stack`, and a `highlightKeys` array — the _count_ of highlight bullets you intend
   to write, referenced by key name, e.g. `['one', 'two', 'three']`).
2. **Prose** — add `experience.roles.<id>.title` (if you want a locale-specific title variant)
   and `experience.roles.<id>.highlights.<key>` for every key listed in `highlightKeys`, in
   **all 17** catalogs (`src/packages/i18n/messages/*.json`). The parity test fails loudly if a
   locale is missing one.
3. That's it — the experience page, the home page's "Where I have worked" section, and the
   resume page all read from `EXPERIENCE_ROLES` directly; there's nothing else to wire.
4. If the new role changes your years-of-experience story, also update
   `PUBLIC_PROFILE.indicators` (see "Update headline numbers" below) — nothing does this
   automatically, and a stale indicator is exactly the kind of unverifiable claim the site is
   built to avoid.

## Add a project (with or without a public case study)

1. **Catalog entry** — `src/modules/projects/constants/projects.constants.ts`: add an object to
   `PROJECTS` (slug, name, `kind: 'open-source' | 'professional'`, `categories` — must be values
   from `PROJECT_CATEGORIES` in `src/modules/projects/types/projects.types.ts`, `stack`, `links`
   — `repository`/`live`, either can be `null`, `repositoryName` — the exact GitHub repo name if
   public, or `null` for an employer-owned system with no public source, `priority` — lower
   sorts first, `featured` — whether it can appear on the home page, `hasCaseStudy`, and
   `fallbackUpdatedAt` — an ISO date shown until GitHub returns real activity data, or `null`).
2. **`hasCaseStudy: true` means a dedicated page exists at `/projects/<slug>`** and needs full
   prose: `projects.items.<slug>.{summary,role,overview,architecture,engineering}` in all 17
   catalogs. `hasCaseStudy: false` means the project only ever appears as a non-clickable row on
   the projects listing — it still needs `projects.items.<slug>.{summary,role}` (the listing
   reads those two), just not the three case-study-only fields.
3. **If `repositoryName` is set**, live GitHub data (stars, language, license, activity) appears
   automatically — no other wiring. See [github-integration.md](./github-integration.md) for
   exactly what's fetched and how it degrades.
4. **If `hasCaseStudy: true`**, the page auto-generates BreadcrumbList and SoftwareSourceCode
   JSON-LD from the catalog entry (`src/app/[locale]/projects/[slug]/page.tsx`) — nothing to add
   there either.
5. Run `npm run test:e2e` locally if you're adding a project likely to be used as a test fixture
   (the current suite references `clawai`, `myoncare`, and `nextranger` by slug in
   `src/tests/e2e/projects.e2e.ts` — a rename or removal of those specific projects will need a
   matching test update; adding a new one doesn't).

## Add or move a skill

`src/modules/skills/constants/skills.constants.ts`: `SKILL_TIER_GROUPS` is four tiers
(`primary`, `strong`, `working`, `foundational`), each a flat array of technology strings — no
per-skill translation, the technology names themselves (`TypeScript`, `PostgreSQL`, …) are
locale-invariant. **The tier is the whole point of this data model**: it's a qualitative claim
about depth of production experience, not a percentage. If you're tempted to add a number next
to a skill, don't — re-read the comment at the top of that file, and if the tier definitions
themselves need adjusting, that's `skills.tiers.<tier>.description` in the catalogs, not a
number anywhere.

## Update headline numbers ("8 years JavaScript", location, availability)

`src/modules/profile/constants/profile.constants.ts` — `PUBLIC_PROFILE`:

- `indicators`: `{ id, years }` pairs rendered on the home page's "At a glance" section
  (`home.indicators.<id>`, interpolating `{years}` — or `years: null` for a non-numeric
  indicator like "End-to-end product delivery"). Every figure here should be one you can defend
  in an interview; there is no "round it up" tolerance built into this codebase's philosophy.
- `email`, `links` (GitHub/LinkedIn/mailto), `locationId` (general area only — this repo's
  standing convention is city-and-country, never a street or precise coordinates),
  `availabilityEnabled` (flip to `true` only when actually open to offers — it's `false` by
  default and nothing implies availability when it's off).
- `curriculumVitaePath`: must point at a file that actually exists in `public/` — see "Update
  the CV PDF" below before changing this.

## Update the CV PDF

The downloadable PDF at `PUBLIC_PROFILE.curriculumVitaePath` (`public/ihab-khaled-cv.pdf`) is
generated from the resume page itself, not authored separately — there is one source of truth
for the on-screen and PDF resume. After editing experience/skills/resume content:

1. `npm run build && npm run start`, then open `/en/resume` in a real browser.
2. Confirm the page looks right on-screen first (the print stylesheet in `src/app/styles.css`
   hides `header`, `footer`, `[data-sonner-toaster]`, and anything marked `print:hidden` — the
   resume page's own download panel carries that class specifically so it doesn't render inside
   itself).
3. Generate the PDF via a headless browser's print-to-PDF (e.g. Playwright's `page.pdf()` with
   `page.emulateMedia({ media: 'print' })`, `format: 'A4'`, `printBackground: true`) and save it
   to `public/ihab-khaled-cv.pdf`, replacing the existing file.
4. Open the regenerated PDF and check it page-by-page — no site chrome, no redundant download
   button, correct page breaks — before committing. This has no automated test; it's a visual
   content artifact, checked by eye each time it changes.

## What never changes as a "content" edit

Skill percentages, unverified stats, and precise personal location are structural decisions this
codebase actively resists (see the project's own `contact.form.sent` copy test in
`src/tests/unit/i18n-catalog-parity.test.ts`, which fails if the "message sent" confirmation
copy claims a delivery guarantee it can't back up). If a requested content change would
reintroduce one of these, that's a product conversation, not a quick edit.
