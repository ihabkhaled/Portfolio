import type { ContactFormLabels, ContactStatus } from '../types/contact-form.types';

/** Which label key backs the status line for a given submission status. */
export const CONTACT_STATUS_MESSAGE_KEYS: Readonly<
  Partial<Record<ContactStatus, keyof ContactFormLabels>>
> = {
  sent: 'sentMessage',
  error: 'errorMessage',
  unavailable: 'unavailableMessage',
};
