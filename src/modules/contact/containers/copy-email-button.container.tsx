'use client';
// client-boundary-reason: reads the system clipboard, a browser-only API.

import type { ReactElement } from 'react';

import { CopyEmailButton } from '../components/copy-email-button.component';
import { useCopyEmailButton } from '../hooks/use-copy-email-button.hook';
import type { CopyEmailButtonContainerProperties } from '../types/copy-email.types';

export function CopyEmailButtonContainer(
  properties: CopyEmailButtonContainerProperties,
): ReactElement {
  const button = useCopyEmailButton(properties);
  return <CopyEmailButton {...button} />;
}
