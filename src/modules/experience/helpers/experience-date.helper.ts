import type { AppLocale } from '@/packages/i18n';

import type { EngagementKind, ExperienceRole } from '../types/experience.types';

/**
Formats an ISO year-month as a locale-aware "month year" label.
*/
export function formatMonthYear(isoMonth: string, locale: AppLocale): string {
  const [year, month] = isoMonth.split('-', 2);
  const parsedYear = Number(year);
  const parsedMonth = Number(month);
  if (!Number.isSafeInteger(parsedYear) || !Number.isSafeInteger(parsedMonth)) {
    return isoMonth;
  }
  const date = new Date(Date.UTC(parsedYear, parsedMonth - 1, 1));
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}

/**
"Jun 2022 – Present" with the localized present label.
*/
export function formatDateRange(
  role: ExperienceRole,
  locale: AppLocale,
  presentLabel: string,
): string {
  const start = formatMonthYear(role.startedAt, locale);
  const end = role.endedAt === null ? presentLabel : formatMonthYear(role.endedAt, locale);
  return `${start} – ${end}`;
}

/**
Roles of one engagement kind, most recent first.
*/
export function selectRolesByKind(
  roles: readonly ExperienceRole[],
  kind: EngagementKind,
): readonly ExperienceRole[] {
  return roles
    .filter((role) => role.kind === kind)
    .toSorted((left, right) => right.startedAt.localeCompare(left.startedAt));
}
