import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as browserPackage from '@/packages/browser';
import type * as PackagesI18n from '@/packages/i18n';
import enMessages from '@/packages/i18n/messages/en.json';
import { AppToaster } from '@/packages/toast';
import { renderWithProviders } from '@/tests/helpers/render-with-providers';
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

const { ContactPageContainer } = await import('@/modules/contact');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ContactPageContainer', () => {
  it('renders direct contact links and the manifest of identity facts', async () => {
    const element = await ContactPageContainer({ locale: 'en' });
    renderWithProviders(element);

    expect(screen.getByRole('heading', { name: enMessages.contact.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ihab.khaled94@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:ihab.khaled94@gmail.com',
    );
    expect(screen.getByRole('link', { name: enMessages.contact.cvLabel })).toHaveAttribute(
      'href',
      '/ihab-khaled-cv.pdf',
    );
    expect(screen.getByText('https://github.com/ihabkhaled')).toBeInTheDocument();
    expect(screen.getByText(enMessages.contact.formTitle)).toBeInTheDocument();
  });

  it('does not show a copy confirmation when the clipboard write is denied', async () => {
    vi.spyOn(browserPackage, 'copyTextToClipboard').mockResolvedValue(false);

    const element = await ContactPageContainer({ locale: 'en' });
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <AppToaster />
        {element}
      </>,
    );

    await user.click(screen.getByRole('button', { name: enMessages.contact.copyEmail }));

    expect(screen.queryByText(enMessages.contact.copied)).not.toBeInTheDocument();
  });

  it('fails silently when the clipboard promise rejects', async () => {
    vi.spyOn(browserPackage, 'copyTextToClipboard').mockRejectedValue(new Error('denied'));

    const element = await ContactPageContainer({ locale: 'en' });
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <AppToaster />
        {element}
      </>,
    );

    await user.click(screen.getByRole('button', { name: enMessages.contact.copyEmail }));

    expect(screen.queryByText(enMessages.contact.copied)).not.toBeInTheDocument();
  });

  it('copies the email address to the clipboard and confirms with a toast', async () => {
    const copySpy = vi.spyOn(browserPackage, 'copyTextToClipboard').mockResolvedValue(true);

    const element = await ContactPageContainer({ locale: 'en' });
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <AppToaster />
        {element}
      </>,
    );

    await user.click(screen.getByRole('button', { name: enMessages.contact.copyEmail }));

    expect(copySpy).toHaveBeenCalledWith('ihab.khaled94@gmail.com');
    await waitFor(() => {
      expect(screen.getByText(enMessages.contact.copied)).toBeInTheDocument();
    });
  });
});
