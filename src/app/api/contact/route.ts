import {
  contactRequestSchema,
  contactResponseSchema,
  createRateLimiter,
  resolveClientKey,
} from '@/modules/contact';
import { getServerEnv } from '@/packages/env/server';
import { appLogger } from '@/packages/logger';
import { ContactEmailUnavailableError, sendContactEmail } from '@/packages/mailer';

const { contactEmail } = getServerEnv();
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

  const parsed = contactRequestSchema.safeParse(await request.json().catch(() => null));
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
