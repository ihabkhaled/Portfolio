'use client';
// client-boundary-reason: submits the form via a mutation and tracks send status.

import type { ReactElement } from 'react';

import { ContactForm } from '../components/contact-form.component';
import { useContactForm } from '../hooks/use-contact-form.hook';
import type { ContactFormContainerProperties } from '../types/contact-form.types';

export function ContactFormContainer(properties: ContactFormContainerProperties): ReactElement {
  const form = useContactForm(properties.labels);

  return (
    <ContactForm
      emailLabel={properties.labels.emailLabel}
      subjectLabel={properties.labels.subjectLabel}
      messageLabel={properties.labels.messageLabel}
      submitLabel={form.submitLabel}
      isSending={form.isSending}
      statusMessage={form.statusMessage}
      onSubmit={form.onSubmit}
    />
  );
}
