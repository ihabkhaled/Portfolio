import type { ReactElement } from 'react';

import { EXPERIENCE_ROLES, formatDateRange } from '@/modules/experience';
import { PUBLIC_PROFILE } from '@/modules/profile';
import { SKILL_TIER_GROUPS } from '@/modules/skills';
import { getServerTranslations } from '@/packages/i18n';
import { ExternalLink } from '@/packages/link';
import { buttonVariants } from '@/packages/ui-primitives';
import { PageIntro, Section } from '@/shared/components/data-display/section.component';
import { sectionClasses } from '@/shared/components/data-display/section.variants';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { resumeClasses } from '../constants/resume-style.constants';
import type { ResumePageContainerProps } from '../types/resume.types';

export async function ResumePageContainer(props: ResumePageContainerProps): Promise<ReactElement> {
  const { locale } = props;
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.resume });
  const tApp = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.app });
  const tExperience = await getServerTranslations({
    locale,
    namespace: I18N_NAMESPACES.experience,
  });
  const tSkills = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.skills });
  const tAbout = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.about });

  const experienceRows = EXPERIENCE_ROLES.map((role) => (
    <div key={role.id} className={resumeClasses.experienceRow}>
      <div className={resumeClasses.experienceHead}>
        <div>
          <p className={resumeClasses.experienceOrg}>{role.organisation}</p>
          <p className={resumeClasses.experienceTitle}>{role.title}</p>
        </div>
        <p className={resumeClasses.experienceDate}>
          {formatDateRange(role, locale, tExperience('present'))}
        </p>
      </div>
    </div>
  ));

  const skillsRows = SKILL_TIER_GROUPS.map((group) => (
    <div key={group.tier} className={resumeClasses.skillsRow}>
      <p className={resumeClasses.skillsTierName}>{tSkills(`tiers.${group.tier}.name`)}</p>
      <p className={resumeClasses.skillsTechnologies}>{group.technologies.join(' · ')}</p>
    </div>
  ));

  return (
    <div className={sectionClasses.page}>
      <PageIntro eyebrow={t('eyebrow')} title={t('title')} lead={t('description')} />

      <div className={sectionClasses.body}>
        <div className={resumeClasses.downloadPanel}>
          <div className={resumeClasses.downloadText}>
            <p className={resumeClasses.downloadTitle}>{t('downloadTitle')}</p>
            <p className={resumeClasses.downloadNote}>{t('downloadNote')}</p>
          </div>
          <ExternalLink
            href={PUBLIC_PROFILE.curriculumVitaePath}
            className={buttonVariants({ variant: 'primary' })}
          >
            {tApp('downloadCv')}
          </ExternalLink>
        </div>

        <Section headingId="resume-summary" eyebrow={t('eyebrow')} title={t('summaryTitle')}>
          <p className={resumeClasses.summary}>{t('summary')}</p>
        </Section>

        <Section headingId="resume-experience" eyebrow={t('eyebrow')} title={t('experienceTitle')}>
          <div className={resumeClasses.experienceList}>{experienceRows}</div>
        </Section>

        <Section headingId="resume-skills" eyebrow={t('eyebrow')} title={t('skillsTitle')}>
          <div className={resumeClasses.skillsList}>{skillsRows}</div>
        </Section>

        <Section headingId="resume-education" eyebrow={t('eyebrow')} title={t('educationTitle')}>
          <p className={resumeClasses.summary}>{tAbout('educationValue')}</p>
        </Section>
      </div>
    </div>
  );
}
