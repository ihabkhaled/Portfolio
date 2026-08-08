import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type * as ModulesProjects from '@/modules/projects';
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

// ProjectListContainer is an async Server Component; RTL's client renderer
// cannot resolve a nested async component, and it has its own dedicated
// test. Stub it here so this test can focus on what HomePageContainer itself
// composes.
vi.mock('@/modules/projects', async (importOriginal) => {
  const actual = await importOriginal<typeof ModulesProjects>();
  return {
    ...actual,
    ProjectListContainer: () => <ul data-testid="project-list-stub" />,
  };
});

const { HomePageContainer } = await import('@/modules/profile');

describe('HomePageContainer', () => {
  it('renders the hero, indicators, capabilities, featured projects, experience preview, approach, and contact CTA', async () => {
    const element = await HomePageContainer({ locale: 'en' });
    render(element);

    expect(screen.getByRole('heading', { name: 'Ihab Khaled', level: 1 })).toBeInTheDocument();
    const cover = screen.getByRole('img', { name: enMessages.app.seoTitle });
    const name = screen.getByRole('heading', { name: 'Ihab Khaled', level: 1 });

    expect(cover).toHaveAttribute('src', expect.stringContaining('%2Fsocial%2Fen.png'));
    expect(cover).toHaveAttribute('width', '1200');
    expect(cover).toHaveAttribute('height', '630');
    expect(cover.compareDocumentPosition(name) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
    expect(screen.getByText(enMessages.home.tagline)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: enMessages.home.ctaProjects })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: enMessages.app.downloadCv })).toHaveAttribute(
      'href',
      '/ihab-khaled-cv.pdf',
    );

    expect(
      screen.getByRole('heading', { name: enMessages.home.capabilitiesTitle }),
    ).toBeInTheDocument();
    expect(screen.getByText(enMessages.home.capabilities.backend)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: enMessages.home.featuredTitle }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('project-list-stub')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: enMessages.home.experienceTitle }),
    ).toBeInTheDocument();
    expect(screen.getByText('Oncare GmbH')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: enMessages.home.approachTitle }),
    ).toBeInTheDocument();
    expect(screen.getByText(enMessages.home.approach.plan.title)).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: enMessages.home.contactTitle })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ihab.khaled94@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:ihab.khaled94@gmail.com',
    );
  });
});
