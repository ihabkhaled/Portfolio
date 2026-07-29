import { describe, expect, it } from 'vitest';

import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { http, HttpResponse } from '@/tests/msw/handler-tools';
import { mswServer } from '@/tests/msw/server';

import { postContactRequest } from '../gateway/contact.gateway';
import type { ContactRequest } from '../schemas/contact.schema';

const payload: ContactRequest = {
  email: 'visitor@example.com',
  subject: 'Project inquiry',
  message: 'A message with more than the minimum length required.',
};

describe('postContactRequest', () => {
  it('resolves with the parsed response on success', async () => {
    await expect(postContactRequest(payload)).resolves.toEqual({ sent: true });
  });

  it('rejects when the server reports the send channel is unavailable', async () => {
    mswServer.use(
      http.post(API_ROUTES.contact, () =>
        HttpResponse.json({ message: 'unavailable' }, { status: 503 }),
      ),
    );

    await expect(postContactRequest(payload)).rejects.toThrow();
  });

  it('rejects when the response body does not match the response schema', async () => {
    mswServer.use(http.post(API_ROUTES.contact, () => HttpResponse.json({ sent: false })));

    await expect(postContactRequest(payload)).rejects.toThrow();
  });
});
