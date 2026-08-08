# EXC-0008: `dayjs.extend()` module-scope plugin registration

## Identification

- **Id**: EXC-0008
- **Date filed**: 2026-08-08
- **Owner**: Ihab Khaled
- **Expiry**: permanent — re-reviewed at every `eslint-plugin-unicorn` upgrade

## Scope

- **Rule / gate bypassed**: `unicorn/no-top-level-side-effects`
- **Exact location(s)**: `src/packages/date/app-date.ts`, the three `dayjs.extend(...)` calls immediately after the imports
- **Blast radius**: none — the suppressed lines only register dayjs plugins; no runtime behavior outside this module is hidden

## Justification

- **Reason**: `dayjs`'s plugin system requires `dayjs.extend(plugin)` to run once, before any consumer calls `.locale()`, `.format('LL')`, `.fromNow()`, or `.utc()` — the exact methods this module's exported helpers (`formatDisplayDate`, `formatRelativeToNow`, `toIsoString`, etc.) depend on. This is dayjs's own documented initialization pattern, not an incidental side effect.
- **Alternatives considered**: lazily calling `dayjs.extend(...)` inside each exported function — rejected, since it would re-run the (idempotent but non-trivial) extension on every call instead of once at load, and would still be a "side effect", just relocated; a module-level `let initialized` guard — rejected as strictly more code to achieve the same one-time registration the module system already guarantees for free.

## Risk control

- **Mitigation**: this file is the sole owner of dayjs configuration (`src/packages/date` is the one wrapper package for the `dayjs` third-party dependency per `eslint/package-boundaries.config.mjs`); no other file calls `dayjs.extend`.
- **Detection**: if a plugin were missing or mis-ordered, the affected formatter would throw or return an unformatted value immediately, and `src/packages/date`'s unit tests would fail.

## Removal plan

- **Removal trigger**: an `eslint-plugin-unicorn` release that recognizes idempotent library-initialization calls (e.g. exempts known plugin-registration APIs), or dayjs shipping a side-effect-free registration API.
- **Removal steps**: delete the `eslint-disable` comment and this document's register entry; re-run `npm run lint`.
- **Review cadence**: every `eslint-plugin-unicorn` major-version upgrade.

## Sign-off

- **Architect approval**: Ihab Khaled, 2026-08-08
- **Status**: active
