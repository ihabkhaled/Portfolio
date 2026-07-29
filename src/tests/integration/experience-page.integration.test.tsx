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

const { ExperiencePageContainer } = await import('@/modules/experience');

describe('ExperiencePageContainer', () => {
  it('groups roles by employment vs independent work with formatted date ranges', async () => {
    const element = await ExperiencePageContainer({ locale: 'en' });
    render(element);

    expect(screen.getByRole('heading', { name: enMessages.experience.title })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: enMessages.experience.employmentTitle }),
    ).toBeInTheDocument();
    expect(screen.getByText('Oncare GmbH')).toBeInTheDocument();
    expect(screen.getByText('Garment IO')).toBeInTheDocument();
    expect(screen.getByText('eSEED')).toBeInTheDocument();
    expect(screen.getByText('Jun 2022 – Present')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: enMessages.experience.independentTitle }),
    ).toBeInTheDocument();
    expect(screen.getByText('Independent')).toBeInTheDocument();

    expect(screen.getByText(enMessages.experience.roles.oncare.highlights.one)).toBeInTheDocument();
  });
});
