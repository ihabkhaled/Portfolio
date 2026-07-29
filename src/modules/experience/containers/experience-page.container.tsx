import type { ReactElement } from 'react';

import { getServerTranslations } from '@/packages/i18n';
import { ExternalLink } from '@/packages/link';
import { Badge } from '@/packages/ui-primitives';
import { PageIntro } from '@/shared/components/data-display/section.component';
import { sectionClasses } from '@/shared/components/data-display/section.variants';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import {
  ExperienceRoleCard,
  ExperienceRoleGroup,
} from '../components/experience-role-card.component';
import { experienceClasses } from '../constants/experience-style.constants';
import { EXPERIENCE_ROLES } from '../constants/experience.constants';
import { formatDateRange, selectRolesByKind } from '../helpers/experience-date.helper';
import type { ExperiencePageContainerProps } from '../types/experience.types';

export async function ExperiencePageContainer(
  props: ExperiencePageContainerProps,
): Promise<ReactElement> {
  const { locale } = props;
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.experience });

  const buildRoleCards = (kind: 'employment' | 'independent') =>
    selectRolesByKind(EXPERIENCE_ROLES, kind).map((role) => {
      const highlights = role.highlightKeys.map((key) => (
        <li key={key} className={experienceClasses.highlight}>
          <span className={experienceClasses.highlightMarker} aria-hidden />
          {t(`roles.${role.id}.highlights.${key}`)}
        </li>
      ));
      const stack = role.stack.map((technology) => (
        <Badge key={technology} tone="outline">
          {technology}
        </Badge>
      ));

      return (
        <ExperienceRoleCard
          key={role.id}
          organisation={role.organisation}
          title={role.title}
          dateRange={formatDateRange(role, locale, t('present'))}
          summary={t(`roles.${role.id}.summary`)}
          highlights={highlights}
          stack={stack}
          websiteLink={
            role.website === null ? null : (
              <ExternalLink href={role.website} className={experienceClasses.websiteLink}>
                {role.website.replace('https://', '')}
              </ExternalLink>
            )
          }
        />
      );
    });

  return (
    <div className={sectionClasses.page}>
      <PageIntro eyebrow={t('eyebrow')} title={t('title')} lead={t('description')} />
      <div className={sectionClasses.body}>
        <ExperienceRoleGroup title={t('employmentTitle')} roles={buildRoleCards('employment')} />
        <div className={sectionClasses.body}>
          <ExperienceRoleGroup
            title={t('independentTitle')}
            roles={buildRoleCards('independent')}
          />
        </div>
      </div>
    </div>
  );
}
