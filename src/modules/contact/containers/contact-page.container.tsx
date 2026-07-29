import type { ReactElement } from 'react';

import { PUBLIC_PROFILE } from '@/modules/profile';
import { getServerTranslations } from '@/packages/i18n';
import { ExternalLink } from '@/packages/link';
import { buttonVariants } from '@/packages/ui-primitives';
import {
  ManifestPanel,
  ManifestRow,
  PageIntro,
} from '@/shared/components/data-display/section.component';
import { sectionClasses } from '@/shared/components/data-display/section.variants';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { contactPageClasses } from '../constants/contact-page-style.constants';
import type { ContactPageContainerProps } from '../types/contact-page.types';

import { ContactFormContainer } from './contact-form.container';
import { CopyEmailButtonContainer } from './copy-email-button.container';

export async function ContactPageContainer(
  props: ContactPageContainerProps,
): Promise<ReactElement> {
  const { locale } = props;
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.contact });

  const linkedin = PUBLIC_PROFILE.links.find((link) => link.id === 'linkedin');
  const github = PUBLIC_PROFILE.links.find((link) => link.id === 'github');

  const manifestRows = [
    { label: t('emailLabel'), value: PUBLIC_PROFILE.email, mono: true },
    ...(github === undefined ? [] : [{ label: t('githubLabel'), value: github.href, mono: true }]),
    ...(linkedin === undefined
      ? []
      : [{ label: t('linkedinLabel'), value: linkedin.href, mono: true }]),
  ];

  return (
    <div className={sectionClasses.page}>
      <PageIntro eyebrow={t('eyebrow')} title={t('title')} lead={t('description')} />
      <div className={sectionClasses.body}>
        <div className={contactPageClasses.layout}>
          <div>
            {PUBLIC_PROFILE.availabilityEnabled ? (
              <p className={contactPageClasses.availability}>{t('availabilityNote')}</p>
            ) : null}
            <p className={contactPageClasses.directTitle}>{t('directTitle')}</p>
            <div className={contactPageClasses.directActions}>
              <ExternalLink
                href={`mailto:${PUBLIC_PROFILE.email}`}
                className={buttonVariants({ variant: 'primary', size: 'sm' })}
              >
                {PUBLIC_PROFILE.email}
              </ExternalLink>
              <CopyEmailButtonContainer
                email={PUBLIC_PROFILE.email}
                labels={{ copyLabel: t('copyEmail'), copiedLabel: t('copied') }}
              />
              <ExternalLink
                href={PUBLIC_PROFILE.curriculumVitaePath}
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                {t('cvLabel')}
              </ExternalLink>
            </div>
            <ManifestPanel
              rows={manifestRows.map((row) => (
                <ManifestRow key={row.label} {...row} />
              ))}
            />
          </div>
          <div className={contactPageClasses.formPanel}>
            <p className={contactPageClasses.formTitle}>{t('formTitle')}</p>
            <p className={contactPageClasses.formNote}>{t('formNote')}</p>
            <ContactFormContainer
              labels={{
                emailLabel: t('form.emailLabel'),
                subjectLabel: t('form.subjectLabel'),
                messageLabel: t('form.messageLabel'),
                submitIdle: t('form.submit'),
                submitSending: t('form.sending'),
                sentMessage: t('form.sent'),
                errorMessage: t('form.error'),
                unavailableMessage: t('form.unavailable'),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
