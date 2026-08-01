import type { AppLocale } from '@/packages/i18n';

/** Depth of production experience — never a numeric score. */
export const SKILL_TIERS = ['primary', 'strong', 'working', 'foundational', 'aiTools'] as const;

export type SkillTier = (typeof SKILL_TIERS)[number];

export interface SkillTierGroup {
  readonly tier: SkillTier;
  readonly technologies: readonly string[];
}

export interface SkillsPageContainerProps {
  readonly locale: AppLocale;
}
