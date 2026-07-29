/**
 * Projects render as editorial rows rather than a card grid: full-measure
 * entries separated by hairlines, with the metadata manifest aligned right.
 * The leading accent rule appears on hover and focus, never on hover alone.
 */
export const projectRowClasses = {
  list: 'grid overflow-hidden rounded-lg border border-border bg-surface-raised',
  item: 'group relative border-b border-border last:border-b-0',
  link: 'grid gap-5 px-5 py-7 transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 sm:px-7 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10',
  accent:
    'absolute inset-y-0 start-0 w-0.5 scale-y-0 bg-primary transition-transform group-hover:scale-y-100 group-focus-within:scale-y-100',
  head: 'grid gap-2.5',
  titleRow: 'flex flex-wrap items-center gap-3',
  name: 'font-display text-xl font-semibold tracking-tight text-foreground',
  summary: 'max-w-xl leading-relaxed text-muted-foreground text-pretty',
  role: 'max-w-xl text-sm leading-relaxed text-muted-foreground',
  meta: 'grid content-start gap-3',
  stack: 'flex flex-wrap gap-1.5',
  metaRow: 'flex flex-wrap items-center gap-x-4 gap-y-1.5',
  metaItem: 'font-mono text-[0.6875rem] text-muted-foreground',
  activeDot: 'inline-flex items-center gap-1.5',
  dot: 'size-1.5 rounded-full bg-success',
  cta: 'font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-primary-readable',
  links: 'flex flex-wrap items-center gap-4 pt-1',
  externalLink:
    'text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline',
} as const;

export const projectFilterClasses = {
  bar: 'flex flex-wrap gap-2 border-b border-border pb-6',
  chip: 'rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground',
  chipActive: 'border-foreground bg-foreground text-canvas hover:text-canvas',
  empty: 'py-16 text-center text-muted-foreground',
} as const;

export const caseStudyClasses = {
  back: 'inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground',
  layout: 'grid gap-12 py-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16',
  body: 'grid gap-10',
  block: 'grid gap-3',
  blockTitle: 'font-display text-xl font-semibold tracking-tight text-foreground',
  paragraph: 'max-w-2xl leading-relaxed text-muted-foreground text-pretty',
  aside: 'grid content-start gap-4',
  note: 'rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted-foreground',
} as const;
