/**
Capability keys, in the order they appear under `home.capabilities`.
*/
export const HOME_CAPABILITIES = [
  'backend',
  'fullstack',
  'apis',
  'microservices',
  'events',
  'ai',
  'data',
  'cloud',
  'testing',
  'security',
] as const;

/**
 * The delivery sequence. Order carries meaning here — each step depends on the
 * previous one — which is what justifies the numbered markers in the view.
 */
export const HOME_APPROACH_STEPS = [
  'plan',
  'design',
  'architect',
  'implement',
  'test',
  'deploy',
  'operate',
] as const;

/**
Stable ids so each section heading can label its own region.
*/
export const HOME_SECTION_IDS = {
  indicators: 'home-indicators',
  capabilities: 'home-capabilities',
  projects: 'home-projects',
  experience: 'home-experience',
  approach: 'home-approach',
  contact: 'home-contact',
} as const;

/**
The home page shows a bounded set of featured projects.
*/
export const HOME_FEATURED_LIMIT = 5;
