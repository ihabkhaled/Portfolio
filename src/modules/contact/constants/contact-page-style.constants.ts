export const contactPageClasses = {
  layout: 'grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16',
  directTitle: 'font-display text-base font-semibold tracking-tight text-foreground',
  directActions: 'flex flex-wrap items-center gap-3',
  availability:
    'inline-flex w-fit items-center gap-2 rounded-md border border-success/25 bg-success/8 px-3 py-1.5 text-sm text-success-readable',
  formPanel: 'rounded-lg border border-border bg-surface-raised p-6 sm:p-8',
  formTitle: 'font-display text-lg font-semibold tracking-tight text-foreground',
  formNote: 'mt-1 text-sm text-muted-foreground',
} as const;
