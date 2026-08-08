import { describe, expect, it } from 'vitest';

import { buildPageTitle } from '@/shared/helpers/page-title.helper';
import { mapSchemaIssuesToFieldErrors } from '@/shared/mappers/schema-issues-to-field-errors.mapper';
import { isSafeExternalUrl } from '@/shared/security/external-url.helper';
import { buildIndexedTestId } from '@/shared/testing/test-id.helper';
import { assertNever } from '@/shared/utils/assert-never.utility';
import { isDefined } from '@/shared/utils/is-defined.utility';

describe('isDefined', () => {
  it('narrows away null and undefined but keeps falsy values', () => {
    expect([0, '', null, undefined, false].filter((value) => isDefined(value))).toEqual([
      0,
      '',
      false,
    ]);
  });
});

describe('assertNever', () => {
  it('throws with the unexpected value serialized', () => {
    expect(() => assertNever('surprise' as never)).toThrow(/surprise/);
  });
});

describe('buildPageTitle', () => {
  it('joins section and app name', () => {
    expect(buildPageTitle('Projects')).toBe('Projects · Ihab Khaled');
  });

  it('returns just the app name for blank sections', () => {
    expect(buildPageTitle(' '.repeat(3))).toBe('Ihab Khaled');
  });

  it('does not repeat the app name when the section title already is it', () => {
    expect(buildPageTitle('Ihab Khaled')).toBe('Ihab Khaled');
  });
});

describe('buildIndexedTestId', () => {
  it('joins base and suffix', () => {
    expect(buildIndexedTestId('article-card', 'a-1')).toBe('article-card-a-1');
    expect(buildIndexedTestId('row', 3)).toBe('row-3');
  });
});

describe('isSafeExternalUrl', () => {
  it('accepts https and mailto', () => {
    expect(isSafeExternalUrl('https://example.com/docs')).toBe(true);
    expect(isSafeExternalUrl('mailto:team@example.com')).toBe(true);
  });

  it('rejects http, javascript, data, and malformed values', () => {
    const scriptUrl = ['javascript', 'alert(1)'].join(':');
    // Built dynamically so lint fixers cannot "upgrade" the deliberate http URL.
    const insecureHttpUrl = ['http', '//example.com'].join(':');

    expect(isSafeExternalUrl(insecureHttpUrl)).toBe(false);
    expect(isSafeExternalUrl(scriptUrl)).toBe(false);
    expect(isSafeExternalUrl('data:text/html;base64,x')).toBe(false);
    expect(isSafeExternalUrl('not a url')).toBe(false);
  });
});

describe('mapSchemaIssuesToFieldErrors', () => {
  it('keeps the first issue per field and buckets pathless issues under _root', () => {
    const fieldErrors = mapSchemaIssuesToFieldErrors([
      { path: 'email', message: 'first' },
      { path: 'email', message: 'second' },
      { path: '', message: 'root-level' },
    ]);

    expect(fieldErrors).toEqual({ email: 'first', _root: 'root-level' });
  });

  it('returns an empty object for no issues', () => {
    expect(mapSchemaIssuesToFieldErrors([])).toEqual({});
  });
});
