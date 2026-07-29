import type { ContactFormValues } from '../types/contact-form-values.types';

/** A file input would stringify to "[object File]"; only real text survives. */
export function toFormFieldText(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value : '';
}

/** Reads the three named fields from an uncontrolled form submission. */
export function readContactFormValues(form: HTMLFormElement): ContactFormValues {
  const data = new FormData(form);
  return {
    email: toFormFieldText(data.get('email')),
    subject: toFormFieldText(data.get('subject')),
    message: toFormFieldText(data.get('message')),
  };
}
