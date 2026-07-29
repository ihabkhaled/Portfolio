import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const { ProjectsPageContainer } = await import('@/modules/projects');

describe('ProjectsPageContainer', () => {
  it('lists every project and filters to a single category on chip selection', async () => {
    const user = userEvent.setup();
    const element = await ProjectsPageContainer({ locale: 'en' });
    render(element);

    expect(screen.getByRole('heading', { name: enMessages.projects.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ClawAI' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'myoncare' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: enMessages.projects.filters.healthcare }));

    expect(screen.getByRole('heading', { name: 'myoncare' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'NextRanger' })).not.toBeInTheDocument();
  });

  it('switching the active facet replaces rather than accumulates the filter', async () => {
    const user = userEvent.setup();
    const element = await ProjectsPageContainer({ locale: 'en' });
    render(element);

    await user.click(screen.getByRole('button', { name: enMessages.projects.filters.security }));
    expect(screen.getByRole('heading', { name: 'AuraSpear Platform' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: enMessages.projects.filters.mobile }));
    expect(screen.getByRole('heading', { name: 'FoodOrderV1' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'AuraSpear Platform' })).not.toBeInTheDocument();
  });
});
