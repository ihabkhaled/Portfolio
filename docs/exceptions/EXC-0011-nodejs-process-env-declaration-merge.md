# EXC-0011: `NodeJS.ProcessEnv` declaration-merge interface name

## Identification

- **Id**: EXC-0011
- **Date filed**: 2026-08-08
- **Owner**: Ihab Khaled
- **Expiry**: permanent — re-reviewed at every `eslint-plugin-unicorn` upgrade

## Scope

- **Rule / gate bypassed**: `unicorn/name-replacements`
- **Exact location(s)**: `src/packages/env/environment.d.ts`, the `interface ProcessEnv` inside `declare namespace NodeJS`
- **Blast radius**: real and already observed once — `eslint --fix` silently renamed this to `ProcessEnvironment`, which TypeScript does not reject; it just stops merging with the built-in `@types/node` `NodeJS.ProcessEnv` interface. Every `process.env.SOME_KEY` typed here silently fell back to `[key: string]: string | undefined`, and `noPropertyAccessFromIndexSignature` then flagged 17 previously-valid dot-access reads as TS4111 errors across `src/packages/env/server.ts` and `public-environment.ts`.

## Justification

- **Reason**: TypeScript's declaration merging for ambient global interfaces (`NodeJS.ProcessEnv`, `Window`, etc.) requires the exact interface name to match the one declared upstream. `unicorn/name-replacements` has no concept of "this identifier is a merge target for a third-party ambient type" and renames it like any other local symbol — a silent, auto-fixable break with no compiler error to catch it.
- **Alternatives considered**: none — the interface name is fixed by `@types/node`, not by this codebase.

## Risk control

- **Mitigation**: `npm run typecheck` catches any recurrence immediately and loudly (as it did here) via `TS4111` across every dot-accessed key, so this cannot regress silently a second time.
- **Detection**: `npm run typecheck:app` / `typecheck:test` / `typecheck:node`.

## Removal plan

- **Removal trigger**: an `eslint-plugin-unicorn` release that recognizes ambient/declaration-merge interfaces and excludes them from `name-replacements`.
- **Removal steps**: delete the `eslint-disable` comment and this document's register entry; re-run `npm run lint` and `npm run typecheck`.
- **Review cadence**: every `eslint-plugin-unicorn` major-version upgrade, and immediately after running `eslint --fix` on this file.

## Sign-off

- **Architect approval**: Ihab Khaled, 2026-08-08
- **Status**: active
