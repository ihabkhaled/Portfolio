import type { ReactElement } from 'react';

import { copyEmailButtonClasses } from '../constants/copy-email-button-style.constants';
import type { CopyEmailButtonProperties } from '../types/copy-email.types';

export function CopyEmailButton(properties: CopyEmailButtonProperties): ReactElement {
  return (
    <button type="button" className={copyEmailButtonClasses.button} onClick={properties.onClick}>
      {properties.label}
    </button>
  );
}
