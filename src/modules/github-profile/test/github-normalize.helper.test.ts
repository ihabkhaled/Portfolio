import { describe, expect, it } from 'vitest';

import {
  toLicense,
  toNullableText,
  toPositiveCount,
  toVerifiedHomepage,
} from '../helpers/github-normalize.helper';

describe('toNullableText', () => {
  it('passes real text through trimmed', () => {
    expect(toNullableText('  hello  ')).toBe('hello');
  });

  it.each([
    { label: 'null', value: null },
    { label: 'undefined', value: undefined },
    { label: 'empty string', value: '' },
    { label: 'whitespace only', value: ' '.repeat(3) },
  ])('returns null for $label', ({ value }) => {
    expect(toNullableText(value)).toBeNull();
  });
});

describe('toPositiveCount', () => {
  it('keeps a positive count', () => {
    expect(toPositiveCount(21)).toBe(21);
  });

  it.each([
    { label: 'zero', value: 0 },
    { label: 'null', value: null },
    { label: 'undefined', value: undefined },
  ])('returns null for $label', ({ value }) => {
    expect(toPositiveCount(value)).toBeNull();
  });
});

describe('toVerifiedHomepage', () => {
  it('keeps a valid https URL', () => {
    expect(toVerifiedHomepage('https://example.com')).toBe('https://example.com');
  });

  it('drops a blank value', () => {
    expect(toVerifiedHomepage('')).toBeNull();
  });

  it('drops undefined', () => {
    expect(toVerifiedHomepage(undefined)).toBeNull();
  });

  it('drops a non-https scheme', () => {
    const insecureHomepage = ['http', '//insecure-host'].join(':');
    expect(toVerifiedHomepage(insecureHomepage)).toBeNull();
  });

  it('drops a relative path', () => {
    expect(toVerifiedHomepage('/relative')).toBeNull();
  });
});

describe('toLicense', () => {
  it('keeps a real SPDX id', () => {
    expect(toLicense('Apache-2.0')).toBe('Apache-2.0');
  });

  it('drops NOASSERTION', () => {
    expect(toLicense('NOASSERTION')).toBeNull();
  });

  it('drops null', () => {
    expect(toLicense(null)).toBeNull();
  });

  it('drops undefined', () => {
    expect(toLicense(undefined)).toBeNull();
  });
});
