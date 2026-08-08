/**
 * Explicit process.env typing.
 *
 * Declaring the variables here keeps dot-access legal under
 * noPropertyAccessFromIndexSignature while Next.js can still statically
 * inline NEXT_PUBLIC_* references into the client bundle.
 */

declare namespace NodeJS {
  // eslint-disable-next-line unicorn/name-replacements -- see docs/exceptions/EXC-0011-nodejs-process-env-declaration-merge.md
  interface ProcessEnv {
    readonly NEXT_PUBLIC_APP_ENV?: string;
    readonly NEXT_PUBLIC_APP_URL?: string;
    readonly NEXT_PUBLIC_CONTACT_EMAIL?: string;
    readonly SERVER_API_BASE_URL?: string;
    readonly SERVER_API_MOCKING?: string;
    readonly GITHUB_TOKEN?: string;
    readonly CONTACT_EMAIL_ENABLED?: string;
    readonly CONTACT_EMAIL_PROVIDER?: string;
    readonly CONTACT_EMAIL_FROM?: string;
    readonly CONTACT_EMAIL_TO?: string;
    readonly CONTACT_RATE_LIMIT_MAX?: string;
    readonly CONTACT_RATE_LIMIT_WINDOW_MS?: string;
    readonly CONTACT_SMTP_HOST?: string;
    readonly CONTACT_SMTP_PORT?: string;
    readonly CONTACT_SMTP_SECURE?: string;
    readonly CONTACT_SMTP_USER?: string;
    readonly CONTACT_SMTP_PASS?: string;
  }
}
