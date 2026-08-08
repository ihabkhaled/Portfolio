import type { ReactElement } from 'react';

import { contactFormClasses } from '../constants/contact-form-style.constants';
import {
  CONTACT_EMAIL_MAX_LENGTH,
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MIN_LENGTH,
  CONTACT_SUBJECT_MAX_LENGTH,
  CONTACT_SUBJECT_MIN_LENGTH,
} from '../constants/contact.constants';
import type { ContactFormProperties } from '../types/contact-form.types';

/**
 * Uncontrolled form: no per-keystroke state, bounds mirror the server schema.
 * `role="status"` alone gives the status line an implicit polite live region.
 */
export function ContactForm(properties: ContactFormProperties): ReactElement {
  return (
    <form className={contactFormClasses.form} onSubmit={properties.onSubmit}>
      <div className={contactFormClasses.field}>
        <label className={contactFormClasses.label} htmlFor="contact-email">
          {properties.emailLabel}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={CONTACT_EMAIL_MAX_LENGTH}
          className={contactFormClasses.input}
        />
      </div>
      <div className={contactFormClasses.field}>
        <label className={contactFormClasses.label} htmlFor="contact-subject">
          {properties.subjectLabel}
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          minLength={CONTACT_SUBJECT_MIN_LENGTH}
          maxLength={CONTACT_SUBJECT_MAX_LENGTH}
          className={contactFormClasses.input}
        />
      </div>
      <div className={contactFormClasses.field}>
        <label className={contactFormClasses.label} htmlFor="contact-message">
          {properties.messageLabel}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={CONTACT_MESSAGE_MIN_LENGTH}
          maxLength={CONTACT_MESSAGE_MAX_LENGTH}
          className={contactFormClasses.textarea}
        />
      </div>
      <button
        type="submit"
        disabled={properties.isSending}
        className={contactFormClasses.submitButton}
      >
        {properties.submitLabel}
      </button>
      <p role="status" className={contactFormClasses.status}>
        {properties.statusMessage}
      </p>
    </form>
  );
}
