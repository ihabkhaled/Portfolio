import type { ReactElement } from 'react';

import { EXPERIENCE_ROLES, formatDateRange } from '@/modules/experience';
import { buildRepoActivityReport } from '@/modules/github-profile';
import {
  CURATED_REPOSITORY_NAMES,
  ProjectListContainer,
  PROJECTS,
  selectFeaturedProjects,
} from '@/modules/projects';
import { getServerTranslations } from '@/packages/i18n';
import { AppImage } from '@/packages/image';
import { AppLink, ExternalLink } from '@/packages/link';
import { buttonVariants } from '@/packages/ui-primitives';
import {
  ManifestPanel,
  ManifestRow,
  Section,
} from '@/shared/components/data-display/section.component';
import { sectionClasses } from '@/shared/components/data-display/section.variants';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { Hero } from '../components/hero.component';
import {
  HOME_APPROACH_STEPS,
  HOME_CAPABILITIES,
  HOME_FEATURED_LIMIT,
  HOME_SECTION_IDS,
} from '../constants/home.constants';
import {
  approachClasses,
  capabilityClasses,
  contactCtaClasses,
  heroClasses,
  indicatorClasses,
} from '../constants/profile-style.constants';
import { PUBLIC_PROFILE } from '../constants/profile.constants';
import type { HomePageContainerProperties } from '../types/profile.types';

export async function HomePageContainer(
  properties: HomePageContainerProperties,
): Promise<ReactElement> {
  const { locale } = properties;
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.home });
  const tApp = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.app });
  const tAbout = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.about });
  const tContact = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.contact });
  const tExperience = await getServerTranslations({
    locale,
    namespace: I18N_NAMESPACES.experience,
  });

  const featured = selectFeaturedProjects(PROJECTS, HOME_FEATURED_LIMIT);
  const activity = await buildRepoActivityReport(CURATED_REPOSITORY_NAMES);

  const socialLabels: Readonly<Record<string, string>> = {
    github: tContact('githubLabel'),
    linkedin: tContact('linkedinLabel'),
    email: tContact('emailLabel'),
    phone: tContact('phoneLabel'),
  };

  const heroManifestData = [
    { label: t('profileLabels.location'), value: tAbout('locationValue') },
    { label: t('profileLabels.focus'), value: t('focusValue') },
    {
      label: t('profileLabels.stack'),
      value: 'TypeScript · Node.js · NestJS · React · Next.js',
      mono: true,
    },
    { label: t('profileLabels.languages'), value: tAbout('languagesValue') },
  ];
  const heroAside = (
    <ManifestPanel
      rows={heroManifestData.map((row) => (
        <ManifestRow key={row.label} {...row} />
      ))}
    />
  );

  const indicators = PUBLIC_PROFILE.indicators.map((indicator) => (
    <li key={indicator.id} className={indicatorClasses.item}>
      <p className={indicatorClasses.value}>
        {indicator.years === null
          ? t(`indicators.${indicator.id}`)
          : t(`indicators.${indicator.id}`, { years: indicator.years })}
      </p>
    </li>
  ));

  const capabilities = HOME_CAPABILITIES.map((capability) => (
    <li key={capability} className={capabilityClasses.item}>
      <span className={capabilityClasses.marker} aria-hidden="true" />
      {t(`capabilities.${capability}`)}
    </li>
  ));

  const approach = HOME_APPROACH_STEPS.map((step, index) => (
    <li key={step} className={approachClasses.item}>
      <p className={approachClasses.step}>{String(index + 1).padStart(2, '0')}</p>
      <p className={approachClasses.title}>{t(`approach.${step}.title`)}</p>
      <p className={approachClasses.description}>{t(`approach.${step}.description`)}</p>
    </li>
  ));

  const experienceRows = EXPERIENCE_ROLES.map((role) => (
    <ManifestRow
      key={role.id}
      label={role.organisation}
      value={`${role.title} · ${formatDateRange(role, locale, tExperience('present'))}`}
    />
  ));

  return (
    <>
      <Hero
        cover={
          <AppImage
            src={`/social/${locale}.png`}
            alt={tApp('seoTitle')}
            width={1200}
            height={630}
            sizes="(min-width: 1024px) 55vw, 100vw"
            preload
            className={heroClasses.coverImage}
          />
        }
        eyebrow={t('eyebrow')}
        name={tApp('title')}
        role={tApp('role')}
        tagline={t('tagline')}
        valueProp={t('valueProp')}
        primaryAction={
          <AppLink
            href={buildLocalizedPath(locale, ROUTE_PATHS.projects)}
            className={buttonVariants({ variant: 'primary' })}
          >
            {t('ctaProjects')}
          </AppLink>
        }
        secondaryAction={
          <ExternalLink
            href={PUBLIC_PROFILE.curriculumVitaePath}
            className={buttonVariants({ variant: 'secondary' })}
          >
            {tApp('downloadCv')}
          </ExternalLink>
        }
        tertiaryAction={
          <AppLink
            href={buildLocalizedPath(locale, ROUTE_PATHS.contact)}
            className={buttonVariants({ variant: 'ghost' })}
          >
            {t('ctaContact')}
          </AppLink>
        }
        socialLinks={PUBLIC_PROFILE.links.map((link) => (
          <ExternalLink key={link.id} href={link.href} className={heroClasses.socialLink}>
            {socialLabels[link.id] ?? link.id}
          </ExternalLink>
        ))}
        aside={heroAside}
      />

      <div className={sectionClasses.page}>
        <Section
          headingId={HOME_SECTION_IDS.indicators}
          eyebrow={t('capabilitiesEyebrow')}
          title={t('indicatorsTitle')}
        >
          <ul className={indicatorClasses.list}>{indicators}</ul>
        </Section>

        <Section
          headingId={HOME_SECTION_IDS.capabilities}
          eyebrow={t('capabilitiesEyebrow')}
          title={t('capabilitiesTitle')}
          lead={t('capabilitiesLead')}
        >
          <ul className={capabilityClasses.list}>{capabilities}</ul>
        </Section>

        <Section
          headingId={HOME_SECTION_IDS.projects}
          eyebrow={t('featuredEyebrow')}
          title={t('featuredTitle')}
          lead={t('featuredLead')}
        >
          <ProjectListContainer
            locale={locale}
            projects={featured}
            snapshots={activity.repositories}
            now={new Date()}
          />
          <AppLink
            href={buildLocalizedPath(locale, ROUTE_PATHS.projects)}
            className={sectionClasses.moreLink}
          >
            {t('featuredAll')}
          </AppLink>
        </Section>

        <Section
          headingId={HOME_SECTION_IDS.experience}
          eyebrow={t('experienceEyebrow')}
          title={t('experienceTitle')}
          lead={t('experienceLead')}
        >
          <ManifestPanel rows={experienceRows} />
          <AppLink
            href={buildLocalizedPath(locale, ROUTE_PATHS.experience)}
            className={sectionClasses.moreLink}
          >
            {t('experienceAll')}
          </AppLink>
        </Section>

        <Section
          headingId={HOME_SECTION_IDS.approach}
          eyebrow={t('approachEyebrow')}
          title={t('approachTitle')}
          lead={t('approachLead')}
        >
          <ol className={approachClasses.list}>{approach}</ol>
        </Section>

        <Section
          headingId={HOME_SECTION_IDS.contact}
          eyebrow={t('contactEyebrow')}
          title={t('contactTitle')}
          lead={t('contactLead')}
        >
          <div className={contactCtaClasses.panel}>
            <div className={contactCtaClasses.actions}>
              <ExternalLink
                href={`mailto:${PUBLIC_PROFILE.email}`}
                className={buttonVariants({ variant: 'primary' })}
              >
                {PUBLIC_PROFILE.email}
              </ExternalLink>
              <AppLink
                href={buildLocalizedPath(locale, ROUTE_PATHS.contact)}
                className={buttonVariants({ variant: 'secondary' })}
              >
                {t('ctaContact')}
              </AppLink>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
