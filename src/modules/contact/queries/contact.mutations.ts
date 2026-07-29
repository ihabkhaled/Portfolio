import { useAppMutation } from '@/packages/query';

import type { ContactRequest, ContactResponse } from '../schemas/contact.schema';
import { sendContactRequest } from '../services/send-contact-request.service';

/** No cache to invalidate — a contact submission has no cached list or detail. */
export function useSendContactMutation(): ReturnType<
  typeof useAppMutation<ContactResponse, Error, ContactRequest>
> {
  return useAppMutation({ mutationFn: sendContactRequest });
}
