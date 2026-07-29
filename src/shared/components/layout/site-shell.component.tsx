import type { ReactElement } from 'react';

import type { SiteShellProps } from '../types/shared-component.types';

import { siteShellClasses } from './site-shell.variants';

/**
 * Slot-only application shell: a hairline sticky header, the page body, and a
 * quiet footer. Route and feature owners build every slot; the shell only
 * positions them.
 */
export function SiteShell(props: SiteShellProps): ReactElement {
  return (
    <>
      <header className={siteShellClasses.header}>
        <div className={siteShellClasses.headerInner}>
          {props.brandHomeLink}
          <nav className={siteShellClasses.desktopNav} aria-label={props.navigationLabel}>
            {props.desktopNavigation}
          </nav>
          <div className={siteShellClasses.controls}>
            {props.headerAction}
            {props.controls}
            <details className={siteShellClasses.mobileMenu}>
              <summary className={siteShellClasses.mobileSummary}>{props.menuLabel}</summary>
              <nav className={siteShellClasses.mobilePanel} aria-label={props.navigationLabel}>
                {props.mobileNavigation}
              </nav>
            </details>
          </div>
        </div>
      </header>

      {props.children}

      <footer className={siteShellClasses.footer}>
        <div className={siteShellClasses.footerInner}>
          <p className={siteShellClasses.footerNote}>{props.footerNote}</p>
          <nav className={siteShellClasses.footerLinks} aria-label={props.navigationLabel}>
            {props.footerNavigation}
          </nav>
          <div className={siteShellClasses.footerSocial}>{props.footerSocial}</div>
        </div>
      </footer>
    </>
  );
}
