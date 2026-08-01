import type { PublicProfile } from '../types/profile.types';

const GITHUB_LOGIN = 'ihabkhaled';

/**
 * The single source of truth for public identity. Every page reads from here;
 * nothing about Ihab is duplicated in components or routes.
 */
export const PUBLIC_PROFILE: PublicProfile = {
  displayName: 'Ihab Khaled',
  legalName: 'Ihab Khaled Fouad',
  githubLogin: GITHUB_LOGIN,
  locationId: 'giza',
  email: 'ihab.khaled94@gmail.com',
  // Displayed in international format; the tel: href strips the spaces.
  phone: '+20 100 156 8256',
  links: [
    { id: 'github', href: `https://github.com/${GITHUB_LOGIN}` },
    { id: 'linkedin', href: 'https://www.linkedin.com/in/ihabkhaled94/' },
    { id: 'email', href: 'mailto:ihab.khaled94@gmail.com' },
    { id: 'phone', href: 'tel:+201001568256' },
  ],
  curriculumVitaePath: '/ihab-khaled-cv.pdf',
  // Set to a local asset path once an approved portrait is added to /public.
  portraitPath: null,
  // Flip to true only when actively open to offers; nothing is implied by default.
  availabilityEnabled: false,
  indicators: [
    { id: 'javascript', years: 8 },
    { id: 'node', years: 5 },
    { id: 'typescript', years: 3 },
    { id: 'delivery', years: null },
  ],
} as const;
