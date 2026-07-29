import { setupServer } from 'msw/node';

import { contactHandlers } from './handlers/contact.handlers';
import { githubHandlers } from './handlers/github.handlers';

/**
 * MSW node server for unit/integration tests. Started globally in
 * src/tests/setup/vitest.setup.ts; tests add scenario overrides with
 * `mswServer.use(...)`.
 */
export const mswServer = setupServer(...githubHandlers, ...contactHandlers);
