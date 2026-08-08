import type { ReactElement } from 'react';

import type { SiteShellProperties } from '../types/shared-component.types';

import { siteShellClasses } from './site-shell.variants';

/**
 * Slot-only application shell: a hairline sticky header, the page body, and a
 * quiet footer. Route and feature owners build every slot; the shell only
 * positions them.
 */
export function SiteShell(properties: SiteShellProperties): ReactElement {
  return (
    <>
      <header className={siteShellClasses.header}>
        <div className={siteShellClasses.headerInner}>
          {properties.brandHomeLink}
          <nav className={siteShellClasses.desktopNav} aria-label={properties.navigationLabel}>
            {properties.desktopNavigation}
          </nav>
          <div className={siteShellClasses.controls}>
            {properties.headerAction}
            {properties.controls}
            <details className={siteShellClasses.mobileMenu}>
              <summary className={siteShellClasses.mobileSummary}>{properties.menuLabel}</summary>
              <nav className={siteShellClasses.mobilePanel} aria-label={properties.navigationLabel}>
                {properties.mobileNavigation}
              </nav>
            </details>
          </div>
        </div>
      </header>

      {properties.children}

      <footer className={siteShellClasses.footer}>
        <div className={siteShellClasses.footerInner}>
          <p className={siteShellClasses.footerNote}>{properties.footerNote}</p>
          <nav className={siteShellClasses.footerLinks} aria-label={properties.navigationLabel}>
            {properties.footerNavigation}
          </nav>
          <div className={siteShellClasses.footerSocial}>{properties.footerSocial}</div>
        </div>
      </footer>
    </>
  );
}
