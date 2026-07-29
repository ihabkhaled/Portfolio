import { describe, expect, it } from 'vitest';

import {
  formatDateRange,
  formatMonthYear,
  selectRolesByKind,
} from '../helpers/experience-date.helper';
import type { ExperienceRole } from '../types/experience.types';

function buildRole(overrides: Readonly<Partial<ExperienceRole>> = {}): ExperienceRole {
  return {
    id: 'oncare',
    organisation: 'Oncare GmbH',
    title: 'Senior Software Engineer',
    kind: 'employment',
    startedAt: '2022-06',
    endedAt: null,
    locationId: 'remote',
    website: null,
    stack: [],
    highlightKeys: [],
    ...overrides,
  };
}

describe('formatMonthYear', () => {
  it('formats a valid ISO year-month using the locale calendar', () => {
    expect(formatMonthYear('2022-06', 'en')).toBe('Jun 2022');
  });

  it('returns the raw input when the month segment is not numeric', () => {
    expect(formatMonthYear('2022-xx', 'en')).toBe('2022-xx');
  });

  it('returns the raw input when the year segment is not numeric', () => {
    expect(formatMonthYear('xxxx-06', 'en')).toBe('xxxx-06');
  });
});

describe('formatDateRange', () => {
  it('renders an open-ended role with the localized present label', () => {
    const role = buildRole({ startedAt: '2022-06', endedAt: null });
    expect(formatDateRange(role, 'en', 'Present')).toBe('Jun 2022 – Present');
  });

  it('renders a closed role with both formatted dates', () => {
    const role = buildRole({ startedAt: '2018-12', endedAt: '2022-06' });
    expect(formatDateRange(role, 'en', 'Present')).toBe('Dec 2018 – Jun 2022');
  });
});

describe('selectRolesByKind', () => {
  const roles: readonly ExperienceRole[] = [
    buildRole({ id: 'oncare', kind: 'employment', startedAt: '2022-06' }),
    buildRole({ id: 'garment', kind: 'employment', startedAt: '2018-12' }),
    buildRole({ id: 'freelance', kind: 'independent', startedAt: '2016-06' }),
  ];

  it('filters to the requested kind, most recent first', () => {
    const employment = selectRolesByKind(roles, 'employment');
    expect(employment.map((role) => role.id)).toEqual(['oncare', 'garment']);
  });

  it('returns an empty array when no role matches', () => {
    expect(selectRolesByKind([], 'independent')).toEqual([]);
  });
});
