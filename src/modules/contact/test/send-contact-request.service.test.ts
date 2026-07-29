import { describe, expect, it } from 'vitest';

import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { http, HttpResponse } from '@/tests/msw/handler-tools';
import { mswServer } from '@/tests/msw/server';

import { sendContactRequest } from '../services/send-contact-request.service';

describe('sendContactRequest', () => {
  it('sends the payload and resolves with the gateway confirmation', async () => {
    await expect(
      sendContactRequest({
        email: 'visitor@example.com',
        subject: 'Project inquiry',
        message: 'A message with more than the minimum length required.',
      }),
    ).resolves.toEqual({ sent: true });
  });

  it('propagates a gateway failure', async () => {
    mswServer.use(
      http.post(API_ROUTES.contact, () => HttpResponse.json({ message: 'error' }, { status: 500 })),
    );

    await expect(
      sendContactRequest({
        email: 'visitor@example.com',
        subject: 'Project inquiry',
        message: 'A message with more than the minimum length required.',
      }),
    ).rejects.toThrow();
  });
});
