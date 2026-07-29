import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { GITHUB_API_ORIGIN } from '@/modules/github-profile';
import type * as PackagesI18n from '@/packages/i18n';
import enMessages from '@/packages/i18n/messages/en.json';
import { stubServerTranslations } from '@/tests/helpers/stub-server-translations';
import { http, HttpResponse } from '@/tests/msw/handler-tools';
import { mswServer } from '@/tests/msw/server';

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

const { CaseStudyPageContainer } = await import('@/modules/projects');

describe('CaseStudyPageContainer', () => {
  it('renders the overview, architecture, and engineering sections for an open-source project', async () => {
    const element = await CaseStudyPageContainer({ locale: 'en', slug: 'clawai' });
    render(element);

    expect(screen.getByRole('heading', { name: 'ClawAI', level: 1 })).toBeInTheDocument();
    expect(screen.getByText(enMessages.projects.items.clawai.overview)).toBeInTheDocument();
    expect(screen.getByText(enMessages.projects.items.clawai.architecture)).toBeInTheDocument();
    expect(screen.getByText(enMessages.projects.items.clawai.engineering)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: enMessages.projects.repositoryLabel })).toHaveAttribute(
      'href',
      'https://github.com/ihabkhaled/ClawAI',
    );
  });

  it('omits the live-site link when a case-study project has no verified live URL', async () => {
    const element = await CaseStudyPageContainer({ locale: 'en', slug: 'auraspear' });
    render(element);

    expect(
      screen.getByRole('heading', { name: 'AuraSpear Platform', level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: enMessages.projects.repositoryLabel }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: enMessages.projects.liveLabel })).toBeNull();
  });

  it('omits the language and license manifest rows when GitHub reports neither', async () => {
    mswServer.use(
      http.get(`${GITHUB_API_ORIGIN}/repos/:owner/:repository`, ({ params }) =>
        HttpResponse.json({
          name: params['repository'],
          html_url: `https://github.com/ihabkhaled/${String(params['repository'])}`,
          language: null,
          license: null,
        }),
      ),
    );

    const element = await CaseStudyPageContainer({ locale: 'en', slug: 'clawai' });
    render(element);

    expect(screen.queryByText(enMessages.github.languageLabel)).toBeNull();
    expect(screen.queryByText(enMessages.github.licenseLabel)).toBeNull();
  });

  it('renders a 404 for a project that has no case study', async () => {
    await expect(CaseStudyPageContainer({ locale: 'en', slug: 'myoncare' })).rejects.toThrow();
  });

  it('renders a 404 for an unknown slug', async () => {
    await expect(
      CaseStudyPageContainer({ locale: 'en', slug: 'not-a-real-project' }),
    ).rejects.toThrow();
  });
});
