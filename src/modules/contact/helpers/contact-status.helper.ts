import { CONTACT_STATUS_MESSAGE_KEYS } from '../constants/contact-status-message-keys.constants';
import type {
  ContactFormLabels,
  ContactStatus,
  ContactStatusViewModel,
} from '../types/contact-form.types';

/**
Maps submission status to what the form displays — one place, one truth.
*/
export function buildContactStatusViewModel(
  status: ContactStatus,
  labels: ContactFormLabels,
): ContactStatusViewModel {
  const messageKey = CONTACT_STATUS_MESSAGE_KEYS[status];

  return {
    isSending: status === 'sending',
    submitLabel: status === 'sending' ? labels.submitSending : labels.submitIdle,
    statusMessage: messageKey === undefined ? null : labels[messageKey],
  };
}
