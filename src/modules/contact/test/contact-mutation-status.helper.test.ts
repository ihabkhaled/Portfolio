import { describe, expect, it } from 'vitest';

import { HttpError } from '@/packages/axios';

import { resolveContactStatus } from '../helpers/contact-mutation-status.helper';
import type { ContactMutationState } from '../types/contact-mutation.types';

function buildMutation(
  overrides: Readonly<Partial<ContactMutationState>> = {},
): ContactMutationState {
  return {
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    ...overrides,
  };
}

describe('resolveContactStatus', () => {
  it('returns "sending" while the mutation is pending', () => {
    expect(resolveContactStatus(buildMutation({ isPending: true }))).toBe('sending');
  });

  it('returns "sent" once the mutation succeeds', () => {
    expect(resolveContactStatus(buildMutation({ isSuccess: true }))).toBe('sent');
  });

  it('returns "unavailable" for a 503 HttpError', () => {
    const error = new HttpError({ kind: 'http', message: 'Service unavailable', status: 503 });
    expect(resolveContactStatus(buildMutation({ isError: true, error }))).toBe('unavailable');
  });

  it('returns "error" for a non-503 HttpError', () => {
    const error = new HttpError({ kind: 'http', message: 'Server error', status: 500 });
    expect(resolveContactStatus(buildMutation({ isError: true, error }))).toBe('error');
  });

  it('returns "error" when the error is not an HttpError', () => {
    const error = new Error('boom');
    expect(resolveContactStatus(buildMutation({ isError: true, error }))).toBe('error');
  });

  it('returns "idle" when nothing is pending, successful, or errored', () => {
    expect(resolveContactStatus(buildMutation())).toBe('idle');
  });
});
