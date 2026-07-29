import { buttonVariants } from '@/packages/ui-primitives';

export const contactFormClasses = {
  form: 'grid gap-5',
  field: 'grid gap-2',
  label: 'text-sm font-medium text-foreground',
  input:
    'h-11 rounded-md border border-border bg-surface-raised px-3 text-sm text-foreground outline-none transition-colors focus:border-primary',
  textarea:
    'min-h-40 resize-y rounded-md border border-border bg-surface-raised px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary',
  submitButton: buttonVariants({ variant: 'primary' }),
  status: 'text-sm text-muted-foreground',
} as const;
