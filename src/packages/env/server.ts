import 'server-only';

import { parseSchema, z } from '@/packages/zod';

/** "true"/"false" strings are the only honest booleans an env file can carry. */
const booleanFromString = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

const serverEnvSchema = z
  .object({
    SERVER_API_BASE_URL: z.url().default('http://localhost:4000'),
    SERVER_API_MOCKING: z.enum(['enabled', 'disabled']).default('enabled'),

    /** Optional, server-only. Raises the GitHub rate limit; never sent to the browser. */
    GITHUB_TOKEN: z.string().default(''),

    CONTACT_EMAIL_ENABLED: booleanFromString,
    CONTACT_EMAIL_PROVIDER: z.enum(['smtp']).default('smtp'),
    CONTACT_EMAIL_FROM: z.string().default(''),
    CONTACT_EMAIL_TO: z.string().default(''),
    CONTACT_RATE_LIMIT_MAX: z.coerce.number().int().min(1).max(20).default(3),
    CONTACT_RATE_LIMIT_WINDOW_MS: z.coerce
      .number()
      .int()
      .min(60_000)
      .max(86_400_000)
      .default(3_600_000),
    CONTACT_SMTP_HOST: z.string().default(''),
    CONTACT_SMTP_PORT: z.coerce.number().int().min(1).max(65_535).default(587),
    CONTACT_SMTP_SECURE: booleanFromString,
    CONTACT_SMTP_USER: z.string().default(''),
    CONTACT_SMTP_PASS: z.string().default(''),
  })
  .superRefine((value, ctx) => {
    if (!value.CONTACT_EMAIL_ENABLED) return;
    const required = [
      value.CONTACT_EMAIL_FROM,
      value.CONTACT_EMAIL_TO,
      value.CONTACT_SMTP_HOST,
      value.CONTACT_SMTP_USER,
      value.CONTACT_SMTP_PASS,
    ];
    if (required.some((field) => field.trim() === '')) {
      ctx.addIssue({
        code: 'custom',
        message: 'Enabled contact email requires complete SMTP configuration',
      });
    }
  });

export interface ContactEmailConfig {
  readonly enabled: boolean;
  readonly from: string;
  readonly to: string;
  readonly rateLimitMax: number;
  readonly rateLimitWindowMs: number;
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly user: string;
  readonly pass: string;
}

export interface ServerEnv {
  readonly apiBaseUrl: string;
  readonly apiMocking: 'enabled' | 'disabled';
  readonly githubToken: string | null;
  readonly contactEmail: ContactEmailConfig;
}

let cachedServerEnv: ServerEnv | null = null;

/**
 * Validated server-only environment. Guarded by the `server-only` marker so any
 * accidental client import fails at build time. Misconfiguration fails loudly
 * here rather than silently at send time.
 */
export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const parsed = parseSchema(
    serverEnvSchema,
    {
      SERVER_API_BASE_URL: process.env.SERVER_API_BASE_URL,
      SERVER_API_MOCKING: process.env.SERVER_API_MOCKING,
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      CONTACT_EMAIL_ENABLED: process.env.CONTACT_EMAIL_ENABLED,
      CONTACT_EMAIL_PROVIDER: process.env.CONTACT_EMAIL_PROVIDER,
      CONTACT_EMAIL_FROM: process.env.CONTACT_EMAIL_FROM,
      CONTACT_EMAIL_TO: process.env.CONTACT_EMAIL_TO,
      CONTACT_RATE_LIMIT_MAX: process.env.CONTACT_RATE_LIMIT_MAX,
      CONTACT_RATE_LIMIT_WINDOW_MS: process.env.CONTACT_RATE_LIMIT_WINDOW_MS,
      CONTACT_SMTP_HOST: process.env.CONTACT_SMTP_HOST,
      CONTACT_SMTP_PORT: process.env.CONTACT_SMTP_PORT,
      CONTACT_SMTP_SECURE: process.env.CONTACT_SMTP_SECURE,
      CONTACT_SMTP_USER: process.env.CONTACT_SMTP_USER,
      CONTACT_SMTP_PASS: process.env.CONTACT_SMTP_PASS,
    },
    'server environment',
  );

  cachedServerEnv = {
    apiBaseUrl: parsed.SERVER_API_BASE_URL,
    apiMocking: parsed.SERVER_API_MOCKING,
    githubToken: parsed.GITHUB_TOKEN.trim() === '' ? null : parsed.GITHUB_TOKEN,
    contactEmail: {
      enabled: parsed.CONTACT_EMAIL_ENABLED,
      from: parsed.CONTACT_EMAIL_FROM,
      to: parsed.CONTACT_EMAIL_TO,
      rateLimitMax: parsed.CONTACT_RATE_LIMIT_MAX,
      rateLimitWindowMs: parsed.CONTACT_RATE_LIMIT_WINDOW_MS,
      host: parsed.CONTACT_SMTP_HOST,
      port: parsed.CONTACT_SMTP_PORT,
      secure: parsed.CONTACT_SMTP_SECURE,
      user: parsed.CONTACT_SMTP_USER,
      pass: parsed.CONTACT_SMTP_PASS,
    },
  };

  return cachedServerEnv;
}

/** Test-only seam so suites can re-read a mutated environment. */
export function resetServerEnvCache(): void {
  cachedServerEnv = null;
}
