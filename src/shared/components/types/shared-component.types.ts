import type { ReactNode } from 'react';

export interface SkipLinkProperties {
  readonly targetHref: string;
  readonly label: string;
}

export interface VisuallyHiddenProperties {
  readonly children: ReactNode;
}

export interface PageHeaderProperties {
  readonly title: string;
  readonly subtitle?: string;
}

export interface SectionProperties {
  readonly headingId: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: string;
  readonly children: ReactNode;
}

export interface PageIntroProperties {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
}

export interface ManifestRowData {
  readonly label: string;
  readonly value: ReactNode;
  readonly mono?: boolean;
}

export type ManifestRowProperties = ManifestRowData;

export interface ManifestPanelProperties {
  /**
  Pre-rendered `ManifestRow` elements — the caller owns the `.map()`.
  */
  readonly rows: ReactNode;
}

export interface EmptyStateProperties {
  readonly message: string;
  readonly testId?: string;
}

export interface ErrorStateProperties {
  readonly message: string;
  readonly retryLabel: string;
  readonly onRetry: () => void;
  readonly testId?: string;
}

export interface FormFieldProperties {
  readonly fieldId: string;
  readonly label: string;
  readonly error?: string | undefined;
  readonly children: ReactNode;
}

export interface StructuredDataScriptProperties {
  readonly json: string;
}

export interface SiteShellProperties {
  readonly brandHomeLink: ReactNode;
  readonly desktopNavigation: ReactNode;
  readonly mobileNavigation: ReactNode;
  readonly controls: ReactNode;
  readonly headerAction: ReactNode;
  readonly footerNote: ReactNode;
  readonly footerNavigation: ReactNode;
  readonly footerSocial: ReactNode;
  readonly children: ReactNode;
  readonly navigationLabel: string;
  readonly menuLabel: string;
}
