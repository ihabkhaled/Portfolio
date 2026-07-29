import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type * as PackagesI18n from '@/packages/i18n';
import enMessages from '@/packages/i18n/messages/en.json';
import { stubServerTranslations } from '@/tests/helpers/stub-server-translations';

vi.mock('@/packages/i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof PackagesI18n>();
  return {
    ...actual,
    getServerTranslations: ({
      locale,
      namespace,
    }: {
      locale: PackagesI18n.AppLocale;
      namespace: string;
    }) => stubServerTranslations(locale, namespace),
  };
});

const { ResumePageContainer } = await import('@/modules/resume');

describe('ResumePageContainer', () => {
  it('renders the downloadable CV link, summary, experience, skills, and education', async () => {
    const element = await ResumePageContainer({ locale: 'en' });
    render(element);

    expect(screen.getByRole('heading', { name: enMessages.resume.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: enMessages.app.downloadCv })).toHaveAttribute(
      'href',
      '/ihab-khaled-cv.pdf',
    );

    expect(screen.getByText(enMessages.resume.summary)).toBeInTheDocument();
    expect(screen.getByText('Oncare GmbH')).toBeInTheDocument();
    expect(screen.getByText(enMessages.skills.tiers.primary.name)).toBeInTheDocument();
    expect(screen.getByText(enMessages.about.educationValue)).toBeInTheDocument();
  });
});
