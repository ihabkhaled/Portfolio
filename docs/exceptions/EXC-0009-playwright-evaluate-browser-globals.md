# EXC-0009: browser globals inside `page.evaluate()`

## Identification

- **Id**: EXC-0009
- **Date filed**: 2026-08-08
- **Owner**: Ihab Khaled
- **Expiry**: permanent — re-reviewed at every `eslint-plugin-unicorn` upgrade

## Scope

- **Rule / gate bypassed**: `unicorn/isolated-functions`
- **Exact location(s)**: `src/tests/e2e/contact.e2e.ts`, the `page.evaluate(() => navigator.clipboard.readText())` callback
- **Blast radius**: none — test-only code, never shipped

## Justification

- **Reason**: Playwright serializes the `page.evaluate` callback and runs it inside the real browser page, where `navigator` is a normal global. `unicorn/isolated-functions` treats it as a Node-style isolated/worker context and cannot tell that Playwright's evaluate callbacks execute in a DOM environment with browser globals available.
- **Alternatives considered**: none — referencing `navigator` inside the callback is the only way to read the browser's clipboard via Playwright; there is no non-isolated equivalent.

## Risk control

- **Mitigation**: confined to e2e test files, which never ship; the callback body is a single, trivial expression reviewed alongside this exception.
- **Detection**: a real regression here would fail the test itself (wrong clipboard value), independent of this suppression.

## Removal plan

- **Removal trigger**: an `eslint-plugin-unicorn` release that recognizes Playwright/Puppeteer `page.evaluate` callbacks as browser-context, not isolated.
- **Removal steps**: delete the `eslint-disable` comment and this document's register entry; re-run `npm run lint`.
- **Review cadence**: every `eslint-plugin-unicorn` major-version upgrade.

## Sign-off

- **Architect approval**: Ihab Khaled, 2026-08-08
- **Status**: active
