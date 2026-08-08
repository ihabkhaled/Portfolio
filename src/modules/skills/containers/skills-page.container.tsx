import type { ReactElement } from 'react';

import { getServerTranslations } from '@/packages/i18n';
import { Badge } from '@/packages/ui-primitives';
import { PageIntro } from '@/shared/components/data-display/section.component';
import { sectionClasses } from '@/shared/components/data-display/section.variants';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { SkillTierSection } from '../components/skill-tier.component';
import { SKILL_TIER_GROUPS } from '../constants/skills.constants';
import type { SkillsPageContainerProperties } from '../types/skills.types';

export async function SkillsPageContainer(
  properties: SkillsPageContainerProperties,
): Promise<ReactElement> {
  const { locale } = properties;
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.skills });

  const tiers = SKILL_TIER_GROUPS.map((group) => (
    <SkillTierSection
      key={group.tier}
      headingId={`skills-${group.tier}`}
      name={t(`tiers.${group.tier}.name`)}
      definition={t(`tiers.${group.tier}.definition`)}
      technologies={group.technologies.map((technology) => (
        <Badge key={technology} tone="outline">
          {technology}
        </Badge>
      ))}
    />
  ));

  return (
    <div className={sectionClasses.page}>
      <PageIntro eyebrow={t('eyebrow')} title={t('title')} lead={t('description')} />
      <div className={sectionClasses.body}>
        <p className={sectionClasses.lead}>{t('note')}</p>
        {tiers}
      </div>
    </div>
  );
}
