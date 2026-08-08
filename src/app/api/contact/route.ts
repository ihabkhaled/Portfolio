import {
  contactRequestSchema,
  contactResponseSchema,
  createRateLimiter,
  resolveClientKey,
} from '@/modules/contact';
import { getServerEnvironment } from '@/packages/env/server';
import { appLogger } from '@/packages/logger';
import { ContactEmailUnavailableError, sendContactEmail } from '@/packages/mailer';

const { contactEmail } = getServerEnvironment();
const contactRateLimiter = createRateLimiter(
  contactEmail.rateLimitMax,
  contactEmail.rateLimitWindowMs,
);

function jsonResponse(body: unknown, status: number): Response {
  return Response.json(body, { status });
}

export async function POST(request: Request): Promise<Response> {
  if (!contactRateLimiter.consume(resolveClientKey(request.headers))) {
    return jsonResponse({ error: 'rate_limited' }, 429);
  }

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    requestBody = null;
  }
  const parsed = contactRequestSchema.safeParse(requestBody);
  if (!parsed.success) {
    return jsonResponse({ error: 'invalid_request' }, 400);
  }

  try {
    await sendContactEmail(parsed.data);
  } catch (error) {
    if (error instanceof ContactEmailUnavailableError) {
      return jsonResponse({ error: 'unavailable' }, 503);
    }
    appLogger.error('contact email send failed', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    return jsonResponse({ error: 'send_failed' }, 500);
  }

  return jsonResponse(contactResponseSchema.parse({ sent: true }), 201);
}
