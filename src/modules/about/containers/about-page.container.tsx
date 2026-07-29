import type { ReactElement } from 'react';

import { getServerTranslations } from '@/packages/i18n';
import {
  ManifestPanel,
  ManifestRow,
  PageIntro,
} from '@/shared/components/data-display/section.component';
import { sectionClasses } from '@/shared/components/data-display/section.variants';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { aboutClasses } from '../constants/about-style.constants';
import { ABOUT_PARAGRAPH_KEYS } from '../constants/about.constants';
import type { AboutPageContainerProps } from '../types/about.types';

export async function AboutPageContainer(props: AboutPageContainerProps): Promise<ReactElement> {
  const { locale } = props;
  const t = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.about });

  const paragraphs = ABOUT_PARAGRAPH_KEYS.map((key) => (
    <p key={key} className={aboutClasses.paragraph}>
      {t(`paragraphs.${key}`)}
    </p>
  ));

  const manifestRows = [
    { label: t('locationLabel'), value: t('locationValue') },
    { label: t('educationLabel'), value: t('educationValue') },
    { label: t('languagesLabel'), value: t('languagesValue') },
  ];

  return (
    <div className={sectionClasses.page}>
      <PageIntro eyebrow={t('eyebrow')} title={t('title')} lead={t('description')} />
      <div className={sectionClasses.body}>
        <div className={aboutClasses.layout}>
          <div className={aboutClasses.prose}>{paragraphs}</div>
          <ManifestPanel
            rows={manifestRows.map((row) => (
              <ManifestRow key={row.label} {...row} />
            ))}
          />
        </div>
      </div>
    </div>
  );
}
