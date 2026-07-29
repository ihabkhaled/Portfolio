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

const { SkillsPageContainer } = await import('@/modules/skills');

describe('SkillsPageContainer', () => {
  it('renders every qualitative tier with its technologies, honestly with no scores', async () => {
    const element = await SkillsPageContainer({ locale: 'en' });
    render(element);

    expect(screen.getByRole('heading', { name: enMessages.skills.title })).toBeInTheDocument();
    expect(screen.getByText(enMessages.skills.note)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: enMessages.skills.tiers.primary.name }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: enMessages.skills.tiers.foundational.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(enMessages.skills.tiers.primary.definition)).toBeInTheDocument();

    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
    expect(screen.getByText('Go')).toBeInTheDocument();
    expect(screen.queryByText(/%/u)).not.toBeInTheDocument();
  });
});
