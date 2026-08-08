/**
 * Home-page class bundles. The hero pairs a large display headline with the
 * manifest panel so the first thing a reader sees is a claim and its evidence
 * side by side.
 */
export const heroClasses = {
  wrapper: 'relative overflow-hidden border-b border-border',
  grid: 'surface-grid pointer-events-none absolute inset-0',
  inner:
    'relative mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:px-10 lg:py-28',
  content: 'grid gap-6',
  coverFrame:
    'overflow-hidden rounded-xl border border-primary/40 bg-primary/10 p-1 shadow-[0_1.25rem_4rem_-2rem_color-mix(in_oklab,var(--primary)_45%,transparent)]',
  coverImage: 'h-auto w-full rounded-lg border border-border bg-surface-raised object-contain',
  eyebrow:
    'font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-primary-readable',
  name: 'font-display text-[clamp(2.75rem,7vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.035em]',
  role: 'font-display text-xl font-medium tracking-tight text-muted-foreground sm:text-2xl',
  tagline: 'max-w-xl text-lg leading-relaxed text-foreground text-pretty',
  valueProp: 'max-w-xl leading-relaxed text-muted-foreground text-pretty',
  actions: 'flex flex-wrap items-center gap-3 pt-2',
  socialRow: 'flex flex-wrap items-center gap-5 pt-1',
  socialLink:
    'text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline',
  aside: 'grid gap-4',
} as const;

export const indicatorClasses = {
  list: 'grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2',
  item: 'bg-surface-raised px-5 py-4',
  value: 'font-display text-base font-semibold tracking-tight text-foreground',
} as const;

/** Ten capabilities divide evenly into one or two columns — no orphan cells. */
export const capabilityClasses = {
  list: 'grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2',
  item: 'flex items-center gap-3 bg-surface-raised px-5 py-4 text-sm text-foreground',
  marker: 'size-1.5 shrink-0 rounded-full bg-primary',
} as const;

/**
 * The delivery sequence reads as a vertical list: order is the point, and a
 * grid would leave an orphan cell at seven steps.
 */
export const approachClasses = {
  list: 'divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface-raised',
  item: 'grid gap-x-5 gap-y-1 px-5 py-5 sm:grid-cols-[3rem_minmax(0,14rem)_minmax(0,1fr)] sm:items-baseline sm:px-7',
  step: 'font-mono text-[0.6875rem] font-medium tracking-[0.12em] text-muted-foreground',
  title: 'font-display text-base font-semibold tracking-tight text-foreground',
  description: 'text-sm leading-relaxed text-muted-foreground',
} as const;

export const contactCtaClasses = {
  panel:
    'grid gap-6 rounded-lg border border-border bg-surface-raised px-6 py-10 sm:px-10 sm:py-12',
  actions: 'flex flex-wrap items-center gap-3',
} as const;
