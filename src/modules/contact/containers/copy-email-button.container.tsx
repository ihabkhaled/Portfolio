'use client';
// client-boundary-reason: reads the system clipboard, a browser-only API.

import type { ReactElement } from 'react';

import { CopyEmailButton } from '../components/copy-email-button.component';
import { useCopyEmailButton } from '../hooks/use-copy-email-button.hook';
import type { CopyEmailButtonContainerProps } from '../types/copy-email.types';

export function CopyEmailButtonContainer(props: CopyEmailButtonContainerProps): ReactElement {
  const button = useCopyEmailButton(props);
  return <CopyEmailButton {...button} />;
}
