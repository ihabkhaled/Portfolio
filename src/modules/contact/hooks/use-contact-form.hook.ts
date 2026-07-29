'use client';
// client-boundary-reason: holds a TanStack Query mutation and derives status from its lifecycle.

import type { SubmitEvent } from 'react';

import { readContactFormValues } from '../helpers/contact-form-values.helper';
import { resolveContactStatus } from '../helpers/contact-mutation-status.helper';
import { buildContactStatusViewModel } from '../helpers/contact-status.helper';
import { useSendContactMutation } from '../queries/contact.mutations';
import { contactRequestSchema } from '../schemas/contact.schema';
import type { ContactFormLabels, UseContactFormResult } from '../types/contact-form.types';

export function useContactForm(labels: ContactFormLabels): UseContactFormResult {
  const mutation = useSendContactMutation();
  const status = resolveContactStatus(mutation);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = contactRequestSchema.safeParse(readContactFormValues(form));
    if (!parsed.success) return;

    mutation.mutate(parsed.data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return { status, ...buildContactStatusViewModel(status, labels), onSubmit };
}
