import { describe, expect, it } from 'vitest';

import { isCurrentPath } from '../helpers/site-navigation-path.helper';

describe('isCurrentPath', () => {
  const homeHref = '/en';

  it('matches home only on an exact match', () => {
    expect(isCurrentPath('/en', homeHref, homeHref)).toBe(true);
    expect(isCurrentPath('/en/projects', homeHref, homeHref)).toBe(false);
  });

  it('matches a non-home route exactly', () => {
    expect(isCurrentPath('/en/projects', '/en/projects', homeHref)).toBe(true);
  });

  it('matches a nested route under a non-home route', () => {
    expect(isCurrentPath('/en/projects/clawai', '/en/projects', homeHref)).toBe(true);
  });

  it('does not match an unrelated route', () => {
    expect(isCurrentPath('/en/about', '/en/projects', homeHref)).toBe(false);
  });

  it('does not match a route that merely shares a prefix', () => {
    expect(isCurrentPath('/en/projects-archive', '/en/projects', homeHref)).toBe(false);
  });
});
