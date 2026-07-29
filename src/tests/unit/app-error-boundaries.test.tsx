import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import GlobalError from '@/app/global-error';
import { FALLBACK_ERROR_COPY } from '@/shared/constants/fallback-copy.constants';

describe('GlobalError', () => {
  it('renders the documented English fallback copy and calls reset on click', async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<GlobalError reset={reset} />);

    expect(screen.getByRole('heading', { name: FALLBACK_ERROR_COPY.title })).toBeInTheDocument();
    expect(screen.getByText(FALLBACK_ERROR_COPY.description)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: FALLBACK_ERROR_COPY.retry }));

    expect(reset).toHaveBeenCalledOnce();
  });
});
