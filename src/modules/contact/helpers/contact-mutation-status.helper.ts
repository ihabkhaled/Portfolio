import { isHttpError } from '@/packages/axios';

import type { ContactStatus } from '../types/contact-form.types';
import type { ContactMutationState } from '../types/contact-mutation.types';

/**
Maps a mutation's lifecycle to the form's status, distinguishing a 503 from any other failure.
*/
export function resolveContactStatus(mutation: ContactMutationState): ContactStatus {
  if (mutation.isPending) return 'sending';
  if (mutation.isSuccess) return 'sent';
  if (mutation.isError) {
    return isHttpError(mutation.error) && mutation.error.status === 503 ? 'unavailable' : 'error';
  }
  return 'idle';
}
