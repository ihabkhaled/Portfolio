# Exception: unreachable optional-chaining fallback in `resolveClientKey`

## Identification

- **Id**: EXC-0007
- **Date filed**: 2026-07-29
- **Owner**: Ihab Khaled
- **Expiry**: permanent — re-reviewed at every TypeScript-tier upgrade (see Removal plan)

## Scope

- **Rule / gate bypassed**: `npm run test:coverage` branch threshold for `src/**/{utils,helpers,mappers,schemas}/**/*.ts` (100%), via an inline `/* v8 ignore next */`.
- **Exact location(s)**: `src/modules/contact/helpers/request-client-key.helper.ts`, the `?.trim() ?? 'unknown'` fallback on the result of `forwardedFor.split(',', 1)[0]`.
- **Blast radius**: none — the suppressed branch is a type-safety fallback, not a runtime-reachable code path. No behavior is hidden from tests; the function's two real outcomes (proxy-chain present vs. absent) are both covered.

## Justification

- **Reason**: `tsconfig.json` has `noUncheckedIndexedAccess: true`, so `string[]` indexing types as `string | undefined` regardless of runtime guarantees. `''.split(',', 1)` and every other string input always returns an array with at least one element, so `[0]` is never actually `undefined` — but the type checker cannot express that, and the code must satisfy it. The `?.trim() ?? 'unknown'` fallback is therefore unreachable by any real `Headers` value.
- **Alternatives considered**: rewriting as `const [first] = …; first === undefined ? 'unknown' : first.trim()` — same unreachable branch under a different syntax, no improvement. Removing `noUncheckedIndexedAccess` project-wide — rejected outright; it is a load-bearing strictness setting for the whole codebase, not something to weaken for one line.

## Risk control

- **Mitigation**: the two reachable branches (`x-forwarded-for` present with one or more entries, and absent) are both covered by `src/modules/contact/test/request-client-key.helper.test.ts`, including a multi-entry proxy chain and leading/trailing whitespace.
- **Detection**: if this ever became reachable (e.g. a future refactor changes the split call), coverage would only stay green because of the ignore comment — the removal trigger below catches that drift at the next TypeScript upgrade review.

## Removal plan

- **Removal trigger**: a future TypeScript/lib update that narrows `Array#at`/indexed access typing for a fixed-limit `split` result, or a rewrite of this helper that no longer indexes an array.
- **Removal steps**: delete the `/* v8 ignore next */` comment, run `npm run test:coverage`; if the branch still cannot be hit, the trigger has not occurred yet.
- **Review cadence**: every TypeScript version bump (tracked in `skills/upgrade-toolchain.md`).

## Sign-off

- **Architect approval**: Ihab Khaled, 2026-07-29
- **Status**: active
