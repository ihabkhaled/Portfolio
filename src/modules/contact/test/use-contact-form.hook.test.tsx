import { act, renderHook } from '@testing-library/react';
import type { ReactElement, ReactNode, SubmitEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { AppQueryClient, AppQueryClientProvider } from '@/packages/query';

import { useContactForm } from '../hooks/use-contact-form.hook';
import type { ContactFormLabels } from '../types/contact-form.types';

const labels: ContactFormLabels = {
  emailLabel: 'Your email',
  subjectLabel: 'Subject',
  messageLabel: 'Message',
  submitIdle: 'Send message',
  submitSending: 'Sending…',
  sentMessage: 'Message sent.',
  errorMessage: 'Message could not be sent.',
  unavailableMessage: 'The message form is currently unavailable.',
};

function buildFormWithFields(fields: Readonly<Record<string, string>>): HTMLFormElement {
  const form = document.createElement('form');
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    form.append(input);
  }
  return form;
}

function buildQueryClientWrapper(): (props: Readonly<{ children: ReactNode }>) => ReactElement {
  const queryClient = new AppQueryClient({ defaultOptions: { mutations: { retry: false } } });

  function QueryClientWrapper(props: Readonly<{ children: ReactNode }>): ReactElement {
    return <AppQueryClientProvider client={queryClient}>{props.children}</AppQueryClientProvider>;
  }

  return QueryClientWrapper;
}

describe('useContactForm', () => {
  it('never calls mutate when the submitted values fail schema validation', () => {
    const { result } = renderHook(() => useContactForm(labels), {
      wrapper: buildQueryClientWrapper(),
    });
    const form = buildFormWithFields({ email: '', subject: '', message: '' });
    const preventDefault = vi.fn();

    act(() => {
      result.current.onSubmit({
        preventDefault,
        currentTarget: form,
      } as unknown as SubmitEvent<HTMLFormElement>);
    });

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(result.current.status).toBe('idle');
  });
});
