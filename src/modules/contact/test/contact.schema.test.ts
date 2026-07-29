import { describe, expect, it } from 'vitest';

import {
  CONTACT_EMAIL_MAX_LENGTH,
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MIN_LENGTH,
  CONTACT_SUBJECT_MAX_LENGTH,
  CONTACT_SUBJECT_MIN_LENGTH,
} from '../constants/contact.constants';
import { contactRequestSchema, contactResponseSchema } from '../schemas/contact.schema';

const validPayload = {
  email: 'visitor@example.com',
  subject: 'Project inquiry',
  message: 'A message with more than the minimum length required.',
};

describe('contactRequestSchema', () => {
  it('accepts a valid payload', () => {
    expect(contactRequestSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects a malformed email', () => {
    expect(contactRequestSchema.safeParse({ ...validPayload, email: 'not-an-email' }).success).toBe(
      false,
    );
  });

  it('rejects an email over the maximum length', () => {
    const overlong = `${'a'.repeat(CONTACT_EMAIL_MAX_LENGTH)}@example.com`;
    expect(contactRequestSchema.safeParse({ ...validPayload, email: overlong }).success).toBe(
      false,
    );
  });

  it.each([
    { label: 'below minimum', subject: 'ab', expected: false },
    { label: 'at minimum', subject: 'abc', expected: true },
    { label: 'at maximum', subject: 'a'.repeat(CONTACT_SUBJECT_MAX_LENGTH), expected: true },
    {
      label: 'above maximum',
      subject: 'a'.repeat(CONTACT_SUBJECT_MAX_LENGTH + 1),
      expected: false,
    },
    { label: 'empty', subject: '', expected: false },
  ])('subject $label is valid=$expected', ({ subject, expected }) => {
    expect(contactRequestSchema.safeParse({ ...validPayload, subject }).success).toBe(expected);
  });

  it('trims the subject before validating its length', () => {
    const padded = `  ${'a'.repeat(CONTACT_SUBJECT_MIN_LENGTH)}  `;
    const result = contactRequestSchema.parse({ ...validPayload, subject: padded });

    expect(result.subject).toBe('a'.repeat(CONTACT_SUBJECT_MIN_LENGTH));
  });

  it.each([
    { label: 'below minimum', message: 'short', expected: false },
    {
      label: 'at minimum',
      message: 'a'.repeat(CONTACT_MESSAGE_MIN_LENGTH),
      expected: true,
    },
    {
      label: 'at maximum',
      message: 'a'.repeat(CONTACT_MESSAGE_MAX_LENGTH),
      expected: true,
    },
    {
      label: 'above maximum',
      message: 'a'.repeat(CONTACT_MESSAGE_MAX_LENGTH + 1),
      expected: false,
    },
  ])('message $label is valid=$expected', ({ message, expected }) => {
    expect(contactRequestSchema.safeParse({ ...validPayload, message }).success).toBe(expected);
  });

  it('rejects an unknown field to close off payload smuggling', () => {
    expect(
      contactRequestSchema.safeParse({ ...validPayload, unexpected: 'x-header-injection' }).success,
    ).toBe(false);
  });
});

describe('contactResponseSchema', () => {
  it('accepts { sent: true }', () => {
    expect(contactResponseSchema.safeParse({ sent: true }).success).toBe(true);
  });

  it('rejects sent: false', () => {
    expect(contactResponseSchema.safeParse({ sent: false }).success).toBe(false);
  });

  it('rejects an unknown field', () => {
    expect(contactResponseSchema.safeParse({ sent: true, extra: 1 }).success).toBe(false);
  });
});
