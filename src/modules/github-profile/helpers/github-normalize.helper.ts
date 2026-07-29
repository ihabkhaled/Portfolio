import { isSafeExternalUrl } from '@/shared/security/external-url.helper';

/** Blank strings are treated as absent so the view never renders empty rows. */
export function toNullableText(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * Zero is indistinguishable from "no signal" for a portfolio, so counts only
 * survive when positive. This is what keeps `0 stars` off the page.
 */
export function toPositiveCount(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return value > 0 ? value : null;
}

/** A homepage is only shown when it is a safe, absolute https URL. */
export function toVerifiedHomepage(value: string | null | undefined): string | null {
  const candidate = toNullableText(value);
  if (candidate === null) return null;
  return isSafeExternalUrl(candidate) ? candidate : null;
}

/** GitHub uses NOASSERTION for licenses it could not identify. */
export function toLicense(value: string | null | undefined): string | null {
  const candidate = toNullableText(value);
  if (candidate === null || candidate === 'NOASSERTION') return null;
  return candidate;
}
