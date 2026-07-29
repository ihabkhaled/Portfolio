'use client';
// client-boundary-reason: submits the form via a mutation and tracks send status.

import type { ReactElement } from 'react';

import { ContactForm } from '../components/contact-form.component';
import { useContactForm } from '../hooks/use-contact-form.hook';
import type { ContactFormContainerProps } from '../types/contact-form.types';

export function ContactFormContainer(props: ContactFormContainerProps): ReactElement {
  const form = useContactForm(props.labels);

  return (
    <ContactForm
      emailLabel={props.labels.emailLabel}
      subjectLabel={props.labels.subjectLabel}
      messageLabel={props.labels.messageLabel}
      submitLabel={form.submitLabel}
      isSending={form.isSending}
      statusMessage={form.statusMessage}
      onSubmit={form.onSubmit}
    />
  );
}
