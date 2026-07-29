'use client';
// client-boundary-reason: reads the system clipboard, a browser-only API.

import { copyTextToClipboard } from '@/packages/browser';
import { showToast, ToastType } from '@/packages/toast';

import type {
  CopyEmailButtonContainerProps,
  CopyEmailButtonProps,
} from '../types/copy-email.types';

export function useCopyEmailButton(props: CopyEmailButtonContainerProps): CopyEmailButtonProps {
  const onClick = (): void => {
    copyTextToClipboard(props.email)
      .then((didCopy) => {
        if (didCopy) {
          showToast({ type: ToastType.Success, message: props.labels.copiedLabel });
        }
      })
      .catch(() => {
        // Clipboard access can be denied by the browser; failing silently here
        // is correct because the email address is also visible as plain text.
      });
  };

  return { label: props.labels.copyLabel, onClick };
}
