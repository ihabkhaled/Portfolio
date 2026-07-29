import { z } from '@/packages/zod';

import {
  CONTACT_EMAIL_MAX_LENGTH,
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MIN_LENGTH,
  CONTACT_SUBJECT_MAX_LENGTH,
  CONTACT_SUBJECT_MIN_LENGTH,
} from '../constants/contact.constants';

/**
 * `.strict()` rejects unknown fields, closing off header-injection payload
 * smuggling through extra keys. Server-side validation is authoritative; the
 * client form mirrors these bounds but is never trusted on its own.
 */
export const contactRequestSchema = z
  .object({
    email: z.email().max(CONTACT_EMAIL_MAX_LENGTH),
    subject: z.string().trim().min(CONTACT_SUBJECT_MIN_LENGTH).max(CONTACT_SUBJECT_MAX_LENGTH),
    message: z.string().trim().min(CONTACT_MESSAGE_MIN_LENGTH).max(CONTACT_MESSAGE_MAX_LENGTH),
  })
  .strict();

export const contactResponseSchema = z.object({ sent: z.literal(true) }).strict();

export type ContactRequest = z.infer<typeof contactRequestSchema>;
export type ContactResponse = z.infer<typeof contactResponseSchema>;
