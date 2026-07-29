import { http, HttpResponse } from 'msw';

import { API_ROUTES } from '@/shared/api/api-routes.constants';

export const contactHandlers = [
  http.post(API_ROUTES.contact, () => HttpResponse.json({ sent: true }, { status: 201 })),
];
