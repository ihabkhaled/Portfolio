import { describe, expect, it } from 'vitest';

import { buildContactStatusViewModel } from '../helpers/contact-status.helper';
import type { ContactFormLabels } from '../types/contact-form.types';

const labels: ContactFormLabels = {
  emailLabel: 'Your email',
  subjectLabel: 'Subject',
  messageLabel: 'Message',
  submitIdle: 'Send message',
  submitSending: 'Sending…',
  sentMessage: 'Message sent.',
  errorMessage: 'Message could not be sent.',
  unavailableMessage: 'The message form is currently unavailable.',
};

describe('buildContactStatusViewModel', () => {
  it('renders the idle state with no status message', () => {
    expect(buildContactStatusViewModel('idle', labels)).toEqual({
      isSending: false,
      submitLabel: 'Send message',
      statusMessage: null,
    });
  });

  it('renders the sending state with the sending submit label', () => {
    expect(buildContactStatusViewModel('sending', labels)).toEqual({
      isSending: true,
      submitLabel: 'Sending…',
      statusMessage: null,
    });
  });

  it('renders the sent state with the success message', () => {
    expect(buildContactStatusViewModel('sent', labels)).toEqual({
      isSending: false,
      submitLabel: 'Send message',
      statusMessage: 'Message sent.',
    });
  });

  it('renders the error state with the error message', () => {
    expect(buildContactStatusViewModel('error', labels)).toEqual({
      isSending: false,
      submitLabel: 'Send message',
      statusMessage: 'Message could not be sent.',
    });
  });

  it('renders the unavailable state with the unavailable message', () => {
    expect(buildContactStatusViewModel('unavailable', labels)).toEqual({
      isSending: false,
      submitLabel: 'Send message',
      statusMessage: 'The message form is currently unavailable.',
    });
  });
});
