import type { ReactNode } from 'react';

export interface SkipLinkProps {
  readonly targetHref: string;
  readonly label: string;
}

export interface VisuallyHiddenProps {
  readonly children: ReactNode;
}

export interface PageHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
}

export interface SectionProps {
  readonly headingId: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: string;
  readonly children: ReactNode;
}

export interface PageIntroProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
}

export interface ManifestRowData {
  readonly label: string;
  readonly value: ReactNode;
  readonly mono?: boolean;
}

export type ManifestRowProps = ManifestRowData;

export interface ManifestPanelProps {
  /** Pre-rendered `ManifestRow` elements — the caller owns the `.map()`. */
  readonly rows: ReactNode;
}

export interface LoadingStateProps {
  readonly label: string;
  readonly testId?: string;
}

export interface EmptyStateProps {
  readonly message: string;
  readonly testId?: string;
}

export interface ErrorStateProps {
  readonly message: string;
  readonly retryLabel: string;
  readonly onRetry: () => void;
  readonly testId?: string;
}

export interface FormFieldProps {
  readonly fieldId: string;
  readonly label: string;
  readonly error?: string | undefined;
  readonly children: ReactNode;
}

export interface SiteShellProps {
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
