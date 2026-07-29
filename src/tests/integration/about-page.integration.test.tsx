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

const { AboutPageContainer } = await import('@/modules/about');

describe('AboutPageContainer', () => {
  it('renders the localized page intro, prose paragraphs, and manifest facts', async () => {
    const element = await AboutPageContainer({ locale: 'en' });
    render(element);

    expect(screen.getByRole('heading', { name: enMessages.about.title })).toBeInTheDocument();
    expect(screen.getByText(enMessages.about.paragraphs.one)).toBeInTheDocument();
    expect(screen.getByText(enMessages.about.paragraphs.four)).toBeInTheDocument();
    expect(screen.getByText(enMessages.about.locationValue)).toBeInTheDocument();
    expect(screen.getByText(enMessages.about.educationValue)).toBeInTheDocument();
  });
});
