import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const sendMailMock = vi.fn();
const createTransportMock = vi.fn(() => ({ sendMail: sendMailMock }));

vi.mock('nodemailer', () => ({
  default: { createTransport: createTransportMock },
}));

const ENABLED_ENV = {
  CONTACT_EMAIL_ENABLED: 'true',
  CONTACT_EMAIL_FROM: 'noreply@example.com',
  CONTACT_EMAIL_TO: 'owner@example.com',
  CONTACT_SMTP_HOST: 'smtp.example.com',
  CONTACT_SMTP_USER: 'user',
  CONTACT_SMTP_PASS: 'pass',
} as const;

async function loadModuleWithEnv(env: Readonly<Record<string, string>>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value);
  }
  const [{ sendContactEmail }, { ContactEmailUnavailableError }] = await Promise.all([
    import('../send-contact-email'),
    import('../mailer.types'),
  ]);
  return { sendContactEmail, ContactEmailUnavailableError };
}

describe('sendContactEmail', () => {
  beforeEach(() => {
    sendMailMock.mockClear();
    createTransportMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('throws ContactEmailUnavailableError when the channel is disabled', async () => {
    const { sendContactEmail, ContactEmailUnavailableError } = await loadModuleWithEnv({
      CONTACT_EMAIL_ENABLED: 'false',
    });

    await expect(
      sendContactEmail({ email: 'visitor@example.com', subject: 'Hi', message: 'Hello there' }),
    ).rejects.toBeInstanceOf(ContactEmailUnavailableError);
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it('sends with the configured sender as from and the visitor as replyTo', async () => {
    const { sendContactEmail } = await loadModuleWithEnv(ENABLED_ENV);

    await sendContactEmail({
      email: 'visitor@example.com',
      subject: 'Project enquiry',
      message: 'Are you available for contract work?',
    });

    expect(createTransportMock).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.example.com',
        disableFileAccess: true,
        disableUrlAccess: true,
      }),
    );
    const callArgs = sendMailMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(callArgs['from']).toBe('noreply@example.com');
    expect(callArgs['to']).toBe('owner@example.com');
    expect(callArgs['replyTo']).toBe('visitor@example.com');
    expect(callArgs['subject']).toContain('Project enquiry');
    expect(callArgs['text']).toContain('Are you available for contract work?');
  });

  it('sends a plain-text body only, never HTML', async () => {
    const { sendContactEmail } = await loadModuleWithEnv(ENABLED_ENV);

    await sendContactEmail({ email: 'visitor@example.com', subject: 'Hi', message: 'Body' });

    const callArgs = sendMailMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(callArgs['html']).toBeUndefined();
  });
});
