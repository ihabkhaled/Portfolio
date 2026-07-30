# Ihab Khaled — Portfolio & CV

The source for the personal portfolio and CV site of Ihab Khaled, Senior Software Engineer —
built as a real production Next.js application rather than a template with placeholder content.
It started life on a strict frontend engineering OS
([NextRanger](https://github.com/ihabkhaled/NextRanger)) and kept every guardrail that OS
enforces: module-first architecture, machine-checked layer boundaries, TDD gates, and
security/performance/a11y/i18n baselines — same discipline you'd expect from production backend
work, applied to a CV site.

## What's actually on the site

- **17 fully translated locales** (`en ar fr it de hi fa th ja zh es pt ko tr ru id nl`),
  locale-prefixed URLs, reciprocal `hreflang`, and real RTL layouts for Arabic and Persian —
  not just mirrored CSS, but Arabic/Persian prose for every section including case studies.
- **Case-study project pages** sourced from a typed project catalog, enriched at request time
  with **live GitHub data** (stars, primary language, license, last-activity) that degrades to
  static fallback values on any failure or rate limit — the page never breaks because GitHub did.
- **A working contact form** (Zod-validated, rate-limited, SMTP via `nodemailer`) that fails
  safely to a "email me directly" state when no transport is configured, rather than pretending
  to succeed.
- **A downloadable, redacted CV PDF**, generated straight from the resume page's own print
  stylesheet — one source of truth for the on-screen and PDF resume.
- **Installable as a PWA** with an offline fallback route, and JSON-LD structured data
  (`Person`, `WebSite`, `BreadcrumbList`, `SoftwareSourceCode`) on the pages that warrant it.
- **No fake numbers.** Skill levels are grouped by depth of production experience, not rendered
  as percentages; every "years of experience" figure and every stat is one Ihab can defend.

## Quick start

```bash
nvm use
corepack enable
npm install
npm run dev        # http://localhost:3000
```

The pinned toolchain is Node 24.18.0 and npm 12.0.1; `.nvmrc`, `.node-version`, and
`packageManager` keep local and CI installs identical. Copy `.env.example` to `.env` and fill in
only what you need — the site renders fully with every variable at its default (GitHub calls
fall back to static data without `GITHUB_TOKEN`; the contact form reports itself unavailable
without SMTP credentials).

Gates:

```bash
npm run lint             # ESLint, --max-warnings=0
npm run typecheck        # stable TypeScript 7 over app/test/node configs
npm run typecheck:compat # TypeScript 6 API compatibility for ESLint/tooling
npm run test:coverage    # Vitest + coverage thresholds
npm run build            # next build --turbopack
npm run test:e2e:install # one-time Playwright browser install (chromium for this project)
npm run test:e2e:baseline # explicit, reviewed refresh of every current-OS baseline
npm run test:e2e         # Playwright (builds and starts the prod server itself)
npm run test:a11y        # axe + keyboard suites
npm run test:visual      # screenshot baselines
npm run security:audit   # runtime graph, every severity
npm run security:scan    # Trivy: vuln + secret + misconfig
npm run quality:dead-code  # knip
npm run quality:circular   # dependency-cruiser
npm run validate         # everything above, in order
```

> **First-time e2e setup (repeatable on any OS):** run these two local-binary one-time
> steps before the first `npm run validate`:
>
> ```bash
> npm run test:e2e:install   # playwright install chromium
> npm run test:e2e:baseline  # playwright test src/tests/visual --update-snapshots=all
> ```
>
> Visual baselines are **per-OS** (`*-chromium-linux.png`, `*-chromium-win32.png`, …). CI runs
> on Linux and is compare-only — it fails when a Linux baseline is missing or changed. Generate
> or refresh Linux baselines from a matching Linux environment (CI itself, or a container built
> the same way `.github/workflows/e2e.yml` provisions its runner), never cross-platform from
> Windows or macOS; see [testing/visual-testing-standard.md](testing/visual-testing-standard.md).

## Architecture in one breath

`src/app` routes and composes; `src/modules/<feature>` owns each feature through strict layers
(components are TSX-only, hooks orchestrate, services/gateways speak HTTP, mappers translate
wire↔domain, queries own the cache, stores hold client-only state); `src/shared` is generic;
`src/packages` wraps every vendor exactly once; `src/tests` proves all of it; `src/proxy.ts`
signs every response with a nonce CSP.

## Canonical source tree

```txt
src/
  app/            routes, layouts, route handlers — [locale]/ (about, experience, projects,
                  projects/[slug], skills, resume, contact, offline), api/ (contact, health)
  modules/        about, contact, experience, github-profile, profile (home + public identity),
                  projects, pwa, resume, site-navigation, skills, ui-preferences, health
  shared/         config, constants, enums, errors, i18n keys, generic components
  packages/       axios, query, zustand, zod, date, forms, i18n, toast, icons, mailer,
                  ui-primitives, virtuoso, link, image, navigation, env, browser,
                  storage, logger, headers — one owner per vendor
  shared/fonts/   Space Grotesk (display), Inter (body), IBM Plex Mono (utility), and
                  Noto Sans Arabic/Devanagari/Thai — selected per :lang(), one owner
  tests/          setup, msw, unit, integration, e2e, accessibility, visual, factories
  proxy.ts        per-request nonce Content-Security-Policy
eslint/           split flat configs + the frontend-architecture plugin (14 rules)
rules/ skills/ agents/ context/ memory/ testing/ docs/   the governance brain
```

The full annotated map lives in [context/architecture-map.md](context/architecture-map.md).

## The component / container / hook / query / service split

| Layer              | File suffix        | May contain                                 |
| ------------------ | ------------------ | ------------------------------------------- |
| Component          | `.component.tsx`   | JSX from pre-computed props — nothing else  |
| Container          | `.container.tsx`   | `'use client'` + reason; wires hooks to JSX |
| Hook               | `.hook.ts`         | orchestration, translation, view models     |
| Query              | `.queries.ts` etc. | TanStack Query bound to key builders        |
| Service            | `.service.ts`      | use-cases; React does not exist here        |
| Gateway            | `.gateway.ts`      | HTTP wire contracts, Zod-validated          |
| Mapper/Helper/Util | `.mapper.ts` …     | pure logic, 100% branch-covered             |
| Types/Enums/Consts | `.types.ts` …      | declarations only; enums are `as const`     |

See [rules/02-components-and-containers.md](rules/02-components-and-containers.md) and the
real examples quoted in [context/reference-patterns.md](context/reference-patterns.md).

## Every library has one owner

Raw vendor imports outside their owner wrapper fail the lint gate
(`frontend-architecture/no-raw-package-imports`). The complete vendor → owner → facade table
is in [context/package-boundaries.md](context/package-boundaries.md). Adding a package means
adding a wrapper: [skills/create-package-wrapper.md](skills/create-package-wrapper.md).

## Reference modules

- **projects** — the flagship: a typed catalog, category filters, case-study pages that merge
  static content with live GitHub data and degrade safely, and full JSON-LD structured data.
- **contact** — schema-validated form with server-side rate limiting, a real SMTP send path,
  and a distinct "service unavailable" state instead of a silent failure.
- **github-profile** — the server-only GitHub REST integration: optional token, typed responses,
  and a static fallback so a GitHub outage or rate limit never breaks a page.
- **ui-preferences** — Zustand for true client global state (theme/direction) with validated
  persistence and DOM sync through facades.
- **health** — the smallest possible module: one service, one route handler, one test.

## Testing strategy

TDD is policy ([rules/15-testing-and-coverage.md](rules/15-testing-and-coverage.md)): pure
logic first, then services/schemas/mappers, then integration through real providers with MSW,
then Playwright happy/negative paths, axe scans, keyboard walks, and visual baselines across
desktop/tablet/mobile and LTR/RTL/dark theme. Standards live under [testing/](testing/README.md).

## Security and performance defaults

Nonce-based CSP with `strict-dynamic` ([src/proxy.ts](src/proxy.ts)), static security headers
([next.config.ts](next.config.ts)), Zod-validated public/server env split with a `server-only`
guard, sanitized error keys, safe external links (`rel="noopener noreferrer"` on every one),
Trivy + audit gates — see [rules/11-security.md](rules/11-security.md). Server Components
first, justified client boundaries, virtualization for long lists — see
[rules/12-performance.md](rules/12-performance.md).

## Guides

- [Translation guide](docs/translation-guide.md) — how the 17 locale catalogs are structured
  and kept in parity, and the workflow for adding or updating translated copy.
- [Content update guide](docs/content-guide.md) — how to add a job, a project, or a skill
  without touching architecture: which files to edit, in what order.
- [PWA and offline behavior](docs/pwa.md) — what "installable" means here, and what the
  offline fallback route does and doesn't cover.
- [GitHub integration](docs/github-integration.md) — how live repository data is fetched,
  cached, and safely degraded to static fallback values.

## AI tool compatibility

The governance layer this repo inherited is still live and still enforced — useful both for
any coding agent extending this site and as a demonstration of how the discipline holds up in
practice, not just in theory. Point an agent at its entrypoint and it inherits the whole system:

- Universal: [AGENTS.md](AGENTS.md)
- Claude Code: [CLAUDE.md](CLAUDE.md)
- Codex: [CODEX.md](CODEX.md)
- Cursor: [cursor.md](cursor.md), [.cursorrules](.cursorrules), `.cursor/rules/*.mdc`
- Kimi: [KIMI.md](KIMI.md)
- Gemini: [GEMINI.md](GEMINI.md)
- GLM: [GLM.md](GLM.md)
- Qwen: [QWEN.md](QWEN.md)
- DeepSeek: [DEEPSEEK.md](DEEPSEEK.md)

Task-shaped playbooks live in [skills/](skills/README.md); reviewer personas in
[agents/](agents/README.md); durable decisions and pitfalls in [memory/](memory/README.md).

## How to add a new feature

Follow [skills/create-module.md](skills/create-module.md): plan tests first, scaffold the
module layers, expose a public surface via `index.ts`, add route + nav constants, add message
keys to **every** locale catalog, and run the gates. The full lifecycle template is under
[docs/features/\_template/](docs/features/README.md).

## How to add a new package wrapper

[skills/create-package-wrapper.md](skills/create-package-wrapper.md): install, create
`src/packages/<owner>/` with an `index.ts` facade and app-owned types, register the boundary
in [eslint/package-boundaries.config.mjs](eslint/package-boundaries.config.mjs), document it
in [context/package-boundaries.md](context/package-boundaries.md), and test the facade.

## License / status

Private repository — personal portfolio, not a template for reuse. The underlying architecture
it was built on, [NextRanger](https://github.com/ihabkhaled/NextRanger), is the place to look
for a clonable starting point.
