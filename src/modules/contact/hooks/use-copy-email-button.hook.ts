'use client';
// client-boundary-reason: reads the system clipboard, a browser-only API.

import { didCopyTextToClipboard } from '@/packages/browser';
import { showToast, ToastType } from '@/packages/toast';

import type {
  CopyEmailButtonContainerProperties,
  CopyEmailButtonProperties,
} from '../types/copy-email.types';

export function useCopyEmailButton(
  properties: CopyEmailButtonContainerProperties,
): CopyEmailButtonProperties {
  const onClick = (): void => {
    void (async (): Promise<void> => {
      try {
        const didCopy = await didCopyTextToClipboard(properties.email);
        if (didCopy) {
          showToast({ type: ToastType.Success, message: properties.labels.copiedLabel });
        }
      } catch {
        // Clipboard access can be denied by the browser; failing silently here
        // is correct because the email address is also visible as plain text.
      }
    })();
  };

  return { label: properties.labels.copyLabel, onClick };
}
