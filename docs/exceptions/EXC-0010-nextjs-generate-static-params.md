# EXC-0010: `generateStaticParams` is a Next.js-reserved export name

## Identification

- **Id**: EXC-0010
- **Date filed**: 2026-08-08
- **Owner**: Ihab Khaled
- **Expiry**: permanent — re-reviewed at every `eslint-plugin-unicorn` upgrade

## Scope

- **Rule / gate bypassed**: `unicorn/name-replacements`
- **Exact location(s)**: `src/app/[locale]/layout.tsx` and `src/app/[locale]/projects/[slug]/page.tsx`, the exported `generateStaticParams` function
- **Blast radius**: none — renaming would not just be a style regression, it would silently disable static generation for these routes (Next.js discovers this hook by its exact export name)

## Justification

- **Reason**: `generateStaticParams` is a Next.js App Router convention — the framework looks up this exact export name on route/layout files to determine which params to prerender. `unicorn/name-replacements` wants `Params` expanded to `Parameters`, but the function name is not ours to choose.
- **Alternatives considered**: none — this is a framework contract, not an internal naming decision.

## Risk control

- **Mitigation**: both sites are framework entry points with fixed signatures; TypeScript's Next.js route types would fail to match if the export were ever renamed away from the convention.
- **Detection**: a renamed export would cause the affected route to stop being statically generated, which `npm run build`'s route summary output and the static-params-dependent e2e/visual suites would surface immediately.

## Removal plan

- **Removal trigger**: Next.js renaming this convention (unlikely), or `eslint-plugin-unicorn` adding a framework-convention allowlist for `unicorn/name-replacements`.
- **Removal steps**: delete the `eslint-disable` comments and this document's register entry; re-run `npm run lint`.
- **Review cadence**: every `eslint-plugin-unicorn` major-version upgrade.

## Sign-off

- **Architect approval**: Ihab Khaled, 2026-08-08
- **Status**: active
