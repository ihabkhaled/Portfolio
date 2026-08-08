/**
 * Owner wrapper for `next/link`. Internal navigation uses AppLink (typed
 * routes); external links use ExternalLink (rel-safety enforced).
 */

export {
  AppLink,
  ExternalLink,
  type AppLinkProperties,
  type ExternalLinkProperties,
} from './app-link';
