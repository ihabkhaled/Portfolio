import type { ReactElement } from 'react';

import { copyEmailButtonClasses } from '../constants/copy-email-button-style.constants';
import type { CopyEmailButtonProps } from '../types/copy-email.types';

export function CopyEmailButton(props: CopyEmailButtonProps): ReactElement {
  return (
    <button type="button" className={copyEmailButtonClasses.button} onClick={props.onClick}>
      {props.label}
    </button>
  );
}
