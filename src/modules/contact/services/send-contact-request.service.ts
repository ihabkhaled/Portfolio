import { postContactRequest } from '../gateway/contact.gateway';
import type { ContactRequest, ContactResponse } from '../schemas/contact.schema';

/**
React-free use case: validated input in, confirmed send out.
*/
export function sendContactRequest(payload: ContactRequest): Promise<ContactResponse> {
  return postContactRequest(payload);
}
