/**
 * Owner wrapper for environment access. Client code imports `publicEnvironment` from
 * here; server code imports `getServerEnvironment` from `@/packages/env/server`.
 * Raw `process.env` access anywhere else is an ESLint violation.
 */

export { publicEnvironment, type PublicEnvironment } from './public-environment';
