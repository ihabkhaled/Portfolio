import { httpClient } from '@/packages/axios';
import { API_ROUTES } from '@/shared/api/api-routes.constants';

import {
  contactResponseSchema,
  type ContactRequest,
  type ContactResponse,
} from '../schemas/contact.schema';

/**
The only httpClient call site for the contact channel.
*/
export async function postContactRequest(payload: ContactRequest): Promise<ContactResponse> {
  const response = await httpClient.post(API_ROUTES.contact, payload);
  return contactResponseSchema.parse(response.data);
}
