import { afterEach, describe, expect, it, vi } from 'vitest';

import { AppTheme } from '@/shared/enums/app-theme.enum';

import { resolveThemeAttribute } from '../helpers/ui-preferences.helper';

const browserModule = await import('@/packages/browser');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('resolveThemeAttribute', () => {
  it('returns an explicit theme unchanged', () => {
    expect(resolveThemeAttribute(AppTheme.Light)).toBe(AppTheme.Light);
    expect(resolveThemeAttribute(AppTheme.Dark)).toBe(AppTheme.Dark);
  });

  it('resolves system to dark when the OS prefers dark', () => {
    vi.spyOn(browserModule, 'matchesMediaQuery').mockReturnValue(true);
    expect(resolveThemeAttribute(AppTheme.System)).toBe(AppTheme.Dark);
  });

  it('resolves system to light when the OS does not prefer dark', () => {
    vi.spyOn(browserModule, 'matchesMediaQuery').mockReturnValue(false);
    expect(resolveThemeAttribute(AppTheme.System)).toBe(AppTheme.Light);
  });
});
