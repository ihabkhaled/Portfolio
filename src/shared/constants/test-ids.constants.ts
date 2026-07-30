/**
 * data-testid values shared between components and test suites. Raw testid
 * strings in either place are a no-magic-strings violation.
 */
export const TEST_IDS = {
  appHeader: 'app-header',
} as const;

/** Catalog-derived public API. @public */
export type AppTestId = (typeof TEST_IDS)[keyof typeof TEST_IDS];
