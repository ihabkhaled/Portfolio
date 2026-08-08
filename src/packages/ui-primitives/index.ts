/**
 * Owner wrapper for the design-system toolchain (clsx, tailwind-merge,
 * class-variance-authority) and home of the low-level primitives. This is one
 * of the only places raw Tailwind class strings are allowed — everywhere else
 * imports variants/constants.
 */

export { Alert, type AlertProperties } from './alert';
export { alertVariants, type AlertVariantProperties } from './alert.variants';
export { Badge, type BadgeProperties } from './badge';
export { badgeVariants, type BadgeVariantProperties } from './badge.variants';
export { Button, type ButtonProperties } from './button';
export { buttonVariants, type ButtonVariantProperties } from './button.variants';
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProperties,
} from './card';
export { cn } from './cn';
export { Divider, type DividerProperties } from './divider';
export { Input, type InputProperties } from './input';
export { Label, type LabelProperties } from './label';
export { PageContainer, type PageContainerProperties } from './page-container';
export { Select, type SelectProperties } from './select';
export { Skeleton, type SkeletonProperties } from './skeleton';
export { Spinner, type SpinnerProperties } from './spinner';
export { Stack, type StackProperties } from './stack';
export { stackVariants, type StackVariantProperties } from './stack.variants';
export { Textarea, type TextareaProperties } from './textarea';
