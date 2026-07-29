export const resumeClasses = {
  downloadPanel:
    'flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-surface-raised px-6 py-6',
  downloadText: 'grid gap-1',
  downloadTitle: 'font-display text-base font-semibold tracking-tight text-foreground',
  downloadNote: 'max-w-xl text-sm leading-relaxed text-muted-foreground',
  summary: 'max-w-2xl leading-relaxed text-foreground text-pretty',
  experienceList:
    'mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface-raised',
  experienceRow: 'grid gap-1 px-5 py-5 sm:px-7',
  experienceHead: 'flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1',
  experienceOrg: 'font-display text-base font-semibold tracking-tight text-foreground',
  experienceTitle: 'text-sm text-muted-foreground',
  experienceDate: 'shrink-0 font-mono text-[0.6875rem] text-muted-foreground',
  skillsList: 'mt-4 grid gap-3',
  skillsRow:
    'grid grid-cols-[8rem_minmax(0,1fr)] gap-4 border-b border-border pb-3 last:border-b-0',
  skillsTierName:
    'font-mono text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-muted-foreground',
  skillsTechnologies: 'text-sm leading-relaxed text-foreground',
} as const;
