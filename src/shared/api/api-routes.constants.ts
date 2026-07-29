/**
 * Same-origin API route constants. Client code calls these paths — never
 * external hosts and never raw endpoint strings.
 */
export const API_ROUTES = {
  health: '/api/health',
  contact: '/api/contact',
} as const;
