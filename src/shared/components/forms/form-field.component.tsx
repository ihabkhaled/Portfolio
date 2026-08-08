import type { ReactElement } from 'react';

import { Label, Stack } from '@/packages/ui-primitives';

import type { FormFieldProperties } from '../types/shared-component.types';

import { formFieldClasses } from './form-field.variants';

/**
 * Accessible field wrapper: label is bound to the control via htmlFor, and
 * the error region is referenced by the control's aria-describedby
 * (`<fieldId>-error`), wired by the container.
 */
export function FormField(properties: FormFieldProperties): ReactElement {
  return (
    <Stack gap="xs">
      <Label htmlFor={properties.fieldId}>{properties.label}</Label>
      {properties.children}
      {properties.error ? (
        <p id={`${properties.fieldId}-error`} role="alert" className={formFieldClasses.error}>
          {properties.error}
        </p>
      ) : null}
    </Stack>
  );
}
