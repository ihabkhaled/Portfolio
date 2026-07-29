/**
 * Owner wrapper for `nodemailer`. Contact email flows through
 * `sendContactEmail`; raw `nodemailer` imports elsewhere are an ESLint
 * boundary violation.
 */

export { ContactEmailUnavailableError, type ContactEmailInput } from './mailer.types';
export { sendContactEmail } from './send-contact-email';
