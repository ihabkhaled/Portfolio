/**
 * The experience timeline reads as two grouped lists — employment, then
 * independent work — kept visually separate so overlapping date ranges never
 * imply concurrent employers.
 */
export const experienceClasses = {
  groupTitle:
    'font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground',
  list: 'mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface-raised',
  role: 'grid gap-4 px-5 py-7 sm:px-7',
  roleHead: 'flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1',
  organisation: 'font-display text-xl font-semibold tracking-tight text-foreground',
  title: 'text-sm font-medium text-muted-foreground',
  dateRange: 'shrink-0 font-mono text-[0.6875rem] text-muted-foreground',
  summary: 'max-w-2xl leading-relaxed text-muted-foreground text-pretty',
  highlights: 'grid gap-2',
  highlight: 'flex gap-3 text-sm leading-relaxed text-foreground',
  highlightMarker: 'mt-2 size-1 shrink-0 rounded-full bg-primary',
  stack: 'flex flex-wrap gap-1.5 pt-1',
  websiteLink:
    'inline-flex w-fit text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline',
} as const;
