/**
 * Owner wrapper for browser globals (window, document, matchMedia,
 * navigator.clipboard). Direct access elsewhere is an ESLint violation.
 */

export {
  didCopyTextToClipboard,
  getSafeDocument,
  getSafeWindow,
  getBrowserLocationSuffix,
  didOpenEmailDraft,
  isBrowser,
  isMediaQueryMatched,
  isReducedMotionPreferred,
} from './browser-environment';
export { getRootAttribute, setRootAttribute } from './dom-attributes';
export { registerAppServiceWorker } from './service-worker';
