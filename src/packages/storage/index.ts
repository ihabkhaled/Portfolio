/**
 * Owner wrapper for localStorage/sessionStorage. Values are JSON-encoded and
 * schema-validated on read; storage failures degrade to null/false instead of
 * throwing. Direct storage access elsewhere is an ESLint violation.
 */

export { readStorageJson, removeStorageItem, didWriteStorageJson } from './web-storage';
