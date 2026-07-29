import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PROJECTS } from '@/modules/projects';
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

const { ProjectListContainer } = await import('@/modules/projects');

const NOW = new Date('2026-07-29T12:00:00.000Z');

describe('ProjectListContainer', () => {
  it('layers live GitHub metadata over the static catalog and links to the case study', async () => {
    const clawai = PROJECTS.find((project) => project.slug === 'clawai');
    if (!clawai) throw new Error('fixture project "clawai" not found');

    const element = await ProjectListContainer({
      locale: 'en',
      projects: [clawai],
      snapshots: [
        {
          name: 'ClawAI',
          description: null,
          url: 'https://github.com/ihabkhaled/ClawAI',
          homepage: null,
          topics: [],
          primaryLanguage: 'TypeScript',
          stars: 21,
          forks: 1,
          license: 'Apache-2.0',
          lastActivityAt: NOW.toISOString(),
        },
      ],
      now: NOW,
    });
    render(element);

    expect(screen.getByRole('heading', { name: 'ClawAI' })).toBeInTheDocument();
    expect(screen.getByText(enMessages.github.recentlyActive)).toBeInTheDocument();
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
    expect(screen.getByText('21 stars')).toBeInTheDocument();
    expect(screen.getByText('Apache-2.0')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ClawAI/u })).toHaveAttribute(
      'href',
      '/en/projects/clawai',
    );
  });

  it('renders less, never a placeholder, when no live snapshot is available', async () => {
    const myoncare = PROJECTS.find((project) => project.slug === 'myoncare');
    if (!myoncare) throw new Error('fixture project "myoncare" not found');

    const element = await ProjectListContainer({
      locale: 'en',
      projects: [myoncare],
      snapshots: [],
      now: NOW,
    });
    render(element);

    expect(screen.getByRole('heading', { name: 'myoncare' })).toBeInTheDocument();
    expect(screen.queryByText(enMessages.github.recentlyActive)).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
