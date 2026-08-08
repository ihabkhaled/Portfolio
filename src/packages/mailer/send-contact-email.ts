import 'server-only';

import nodemailer from 'nodemailer';

import { getServerEnvironment } from '@/packages/env/server';

import { ContactEmailUnavailableError, type ContactEmailInput } from './mailer.types';

const SUBJECT_PREFIX = '[Portfolio contact]';

/**
 * The only nodemailer import site in the app.
 *
 * `from` is always the configured, provider-verified sender — never the
 * visitor's address, which prevents SPF/DKIM failure and spoofing. The
 * visitor's address goes in `replyTo` only. The body is plain text, so
 * nothing the visitor writes can inject HTML into the inbox. Throws
 * {@link ContactEmailUnavailableError} when the channel is disabled;
 * callers map that to a 503, never a 500.
 */
export async function sendContactEmail(input: ContactEmailInput): Promise<void> {
  const { contactEmail } = getServerEnvironment();

  if (!contactEmail.enabled) {
    throw new ContactEmailUnavailableError();
  }

  const transport = nodemailer.createTransport({
    host: contactEmail.host,
    port: contactEmail.port,
    secure: contactEmail.secure,
    auth: { user: contactEmail.user, pass: contactEmail.pass },
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  await transport.sendMail({
    from: contactEmail.from,
    to: contactEmail.to,
    replyTo: input.email,
    subject: `${SUBJECT_PREFIX} ${input.subject}`,
    text: `From: ${input.email}\n\n${input.message}`,
  });
}
