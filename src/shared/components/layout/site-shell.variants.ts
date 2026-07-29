/**
 * The shell's class bundles. Editorial-technology direction: hairline rules,
 * layered neutral surfaces, one confident accent, and generous whitespace.
 * Nothing here uses a raw palette value — only semantic tokens.
 */
export const siteShellClasses = {
  body: 'min-h-dvh bg-canvas font-sans text-foreground antialiased',

  header:
    'sticky top-0 z-50 border-b border-border bg-canvas/85 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/70',
  headerInner:
    'mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-8 lg:px-10',

  brand: 'group inline-flex shrink-0 items-baseline gap-2.5 text-foreground',
  brandName: 'font-display whitespace-nowrap text-[0.95rem] font-bold tracking-tight',
  brandRole:
    'hidden truncate font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground 2xl:inline',

  desktopNav: 'hidden items-center gap-0.5 md:flex',
  navLink:
    'relative rounded-md px-2.5 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground',
  navLinkCurrent:
    'text-foreground after:absolute after:inset-x-3 after:-bottom-px after:h-px after:bg-primary after:content-[""]',

  controls: 'flex items-center gap-1 sm:gap-1.5',
  headerAction: 'hidden lg:inline-flex',

  mobileMenu: 'relative md:hidden',
  mobileSummary:
    'flex h-10 cursor-pointer list-none items-center gap-1.5 rounded-md border border-border bg-surface-raised px-2.5 text-sm font-medium text-foreground transition-colors hover:border-border-strong [&::-webkit-details-marker]:hidden',
  mobilePanel:
    'absolute end-0 top-12 z-50 grid min-w-56 gap-0.5 rounded-lg border border-border bg-surface-raised p-2 shadow-lg shadow-shadow/10',

  main: 'relative min-h-[60dvh]',

  footer: 'mt-24 border-t border-border bg-surface/40',
  footerInner:
    'mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1.4fr)_auto_auto] lg:gap-16 lg:px-10',
  footerNote: 'max-w-sm text-sm leading-relaxed text-muted-foreground',
  footerLinks: 'grid content-start gap-2.5',
  footerLink: 'text-sm text-muted-foreground transition-colors hover:text-foreground',
  footerSocial: 'grid content-start gap-2.5',

  themeButton: 'size-10 shrink-0 rounded-md px-0',
  localeSelect:
    'h-10 w-auto max-w-20 shrink overflow-hidden text-ellipsis whitespace-nowrap rounded-md py-0 pe-6 text-sm sm:max-w-none sm:min-w-30 sm:pe-3',
} as const;
