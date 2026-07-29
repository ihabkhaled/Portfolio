import type { ReactNode, SubmitEvent } from 'react';

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error' | 'unavailable';

export interface ContactFormLabels {
  readonly emailLabel: string;
  readonly subjectLabel: string;
  readonly messageLabel: string;
  readonly submitIdle: string;
  readonly submitSending: string;
  readonly sentMessage: string;
  readonly errorMessage: string;
  readonly unavailableMessage: string;
}

export interface ContactFormProps {
  readonly emailLabel: string;
  readonly subjectLabel: string;
  readonly messageLabel: string;
  readonly submitLabel: string;
  readonly isSending: boolean;
  readonly statusMessage: string | null;
  readonly onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

export interface ContactFormContainerProps {
  readonly labels: ContactFormLabels;
}

export interface UseContactFormResult {
  readonly status: ContactStatus;
  readonly isSending: boolean;
  readonly submitLabel: string;
  readonly statusMessage: string | null;
  readonly onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

export interface ContactStatusViewModel {
  readonly isSending: boolean;
  readonly submitLabel: string;
  readonly statusMessage: string | null;
}

export interface ContactPageManifestRow {
  readonly label: string;
  readonly value: ReactNode;
}
