import {
  IBM_Plex_Mono,
  Inter,
  Noto_Sans_Arabic,
  Noto_Sans_Devanagari,
  Noto_Sans_Thai,
  Space_Grotesk,
} from 'next/font/google';

/**
 * Owner of next/font. Every face loads with `display: swap` and an adjusted
 * metric fallback so the swap does not shift layout. Script families are
 * declared once here and selected per `:lang()` in src/app/styles.css, so a
 * visitor only downloads files for the script actually rendered.
 */

/** Display face: an engineered grotesque, headings only. */
const displayFont = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display-latin',
  display: 'swap',
});

/** Body face: high legibility across Latin, Latin-ext and Cyrillic. */
const bodyFont = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-body-latin',
  display: 'swap',
});

/** Utility face: metadata rows and technical labels, never prose. */
const monoFont = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-mono-latin',
  display: 'swap',
});

/** Arabic and Persian get a real typeface, never a broken fallback. */
const arabicFont = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
});

const devanagariFont = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
});

const thaiFont = Noto_Sans_Thai({
  subsets: ['thai'],
  variable: '--font-thai',
  display: 'swap',
});

export const appFontClassName = [
  displayFont.variable,
  bodyFont.variable,
  monoFont.variable,
  arabicFont.variable,
  devanagariFont.variable,
  thaiFont.variable,
].join(' ');
