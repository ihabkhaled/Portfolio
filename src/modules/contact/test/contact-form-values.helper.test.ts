import { describe, expect, it } from 'vitest';

import { readContactFormValues, toFormFieldText } from '../helpers/contact-form-values.helper';

function buildForm(fields: Readonly<Record<string, string>>): HTMLFormElement {
  const form = document.createElement('form');
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    form.append(input);
  }
  return form;
}

describe('toFormFieldText', () => {
  it('passes a string value through', () => {
    expect(toFormFieldText('hello@example.com')).toBe('hello@example.com');
  });

  it('returns an empty string for null', () => {
    expect(toFormFieldText(null)).toBe('');
  });

  it('returns an empty string for a File value', () => {
    const file = new File(['content'], 'evidence.txt', { type: 'text/plain' });
    expect(toFormFieldText(file)).toBe('');
  });
});

describe('readContactFormValues', () => {
  it('reads the three named fields from the form', () => {
    const form = buildForm({
      email: 'visitor@example.com',
      subject: 'Hello',
      message: 'A message with enough length.',
    });

    expect(readContactFormValues(form)).toEqual({
      email: 'visitor@example.com',
      subject: 'Hello',
      message: 'A message with enough length.',
    });
  });

  it('defaults missing fields to empty strings', () => {
    expect(readContactFormValues(buildForm({}))).toEqual({
      email: '',
      subject: '',
      message: '',
    });
  });
});
