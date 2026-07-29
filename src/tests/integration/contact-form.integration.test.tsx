import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ContactFormContainer } from '@/modules/contact';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { renderWithProviders } from '@/tests/helpers/render-with-providers';
import { http, HttpResponse } from '@/tests/msw/handler-tools';
import { mswServer } from '@/tests/msw/server';

const labels = {
  emailLabel: 'Your email',
  subjectLabel: 'Subject',
  messageLabel: 'Message',
  submitIdle: 'Send message',
  submitSending: 'Sending…',
  sentMessage: 'Message sent. I will reply to the address you provided.',
  errorMessage: 'Message could not be sent. Please email me directly.',
  unavailableMessage: 'The message form is currently unavailable. Please email me directly.',
};

async function fillValidForm(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  await user.type(screen.getByLabelText('Your email'), 'visitor@example.com');
  await user.type(screen.getByLabelText('Subject'), 'Project inquiry');
  await user.type(
    screen.getByLabelText('Message'),
    'A message with more than the minimum length required.',
  );
}

describe('ContactFormContainer', () => {
  it('starts idle and submits successfully through to the sent confirmation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactFormContainer labels={labels} />);

    expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(await screen.findByText(labels.sentMessage)).toBeInTheDocument();
    expect(screen.getByLabelText('Your email')).toHaveValue('');
  });

  it('shows the generic error message when the server rejects the submission', async () => {
    mswServer.use(
      http.post(API_ROUTES.contact, () => HttpResponse.json({ message: 'boom' }, { status: 500 })),
    );
    const user = userEvent.setup();
    renderWithProviders(<ContactFormContainer labels={labels} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(await screen.findByText(labels.errorMessage)).toBeInTheDocument();
  });

  it('shows the unavailable message when the server reports a 503', async () => {
    mswServer.use(
      http.post(API_ROUTES.contact, () =>
        HttpResponse.json({ message: 'unavailable' }, { status: 503 }),
      ),
    );
    const user = userEvent.setup();
    renderWithProviders(<ContactFormContainer labels={labels} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(await screen.findByText(labels.unavailableMessage)).toBeInTheDocument();
  });
});
