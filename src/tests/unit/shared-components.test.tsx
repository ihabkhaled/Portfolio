import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { LANDMARK_IDS } from '@/shared/accessibility/landmark-ids.constants';
import { PageHeader } from '@/shared/components/data-display/page-header.component';
import { EmptyState } from '@/shared/components/feedback/empty-state.component';
import { ErrorState } from '@/shared/components/feedback/error-state.component';
import { LoadingState } from '@/shared/components/feedback/loading-state.component';
import { FormField } from '@/shared/components/forms/form-field.component';
import { SiteShell } from '@/shared/components/layout/site-shell.component';
import { SkipLink } from '@/shared/components/primitives/skip-link.component';
import { VisuallyHidden } from '@/shared/components/primitives/visually-hidden.component';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';

describe('PageHeader', () => {
  it('renders the h1 with an optional subtitle', () => {
    render(<PageHeader title="Projects" subtitle="Selected work" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByText('Selected work')).toBeInTheDocument();
  });

  it('omits the subtitle when absent', () => {
    render(<PageHeader title="Projects" />);

    expect(screen.queryByText('Selected work')).not.toBeInTheDocument();
  });
});

describe('SkipLink', () => {
  it('targets the main landmark with the translated label', () => {
    render(<SkipLink targetHref={`#${LANDMARK_IDS.mainContent}`} label="Skip to main content" />);

    const link = screen.getByRole('link', { name: 'Skip to main content' });

    expect(link).toHaveAttribute('href', '#main-content');
  });
});

describe('VisuallyHidden', () => {
  it('keeps content in the accessibility tree', () => {
    render(<VisuallyHidden>Screen reader only</VisuallyHidden>);

    expect(screen.getByText('Screen reader only')).toBeInTheDocument();
  });
});

describe('LoadingState', () => {
  it('shows the translated label with a status testid', () => {
    render(<LoadingState label="Loading…" testId="loading" />);

    expect(screen.getByRole('status', { name: 'Loading…' })).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('shows the message and calls onRetry when the retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Something broke." retryLabel="Try again" onRetry={onRetry} />);

    expect(screen.getByText('Something broke.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe('EmptyState', () => {
  it('shows the empty message', () => {
    render(<EmptyState message="Nothing here yet." testId="empty" />);

    expect(screen.getByText('Nothing here yet.')).toBeInTheDocument();
    expect(screen.getByTestId('empty')).toBeInTheDocument();
  });
});

describe('FormField', () => {
  it('binds the label to the control and shows no error region by default', () => {
    render(
      <FormField fieldId="name" label="Name">
        <input id="name" />
      </FormField>,
    );

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders the error message in an alert region referencing the field', () => {
    render(
      <FormField fieldId="name" label="Name" error="Name is required.">
        <input id="name" />
      </FormField>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Name is required.');
    expect(alert).toHaveAttribute('id', 'name-error');
  });
});

describe('SiteShell', () => {
  it('renders every slot in the header, body, and footer', () => {
    render(
      <SiteShell
        brandHomeLink={<a href="#brand">Ihab Khaled</a>}
        desktopNavigation={<span>Desktop nav</span>}
        mobileNavigation={<span>Mobile nav</span>}
        controls={<span>Controls</span>}
        headerAction={<span>Download CV</span>}
        footerNote="Footer note"
        footerNavigation={<span>Footer nav</span>}
        footerSocial={<span>Footer social</span>}
        navigationLabel="Main navigation"
        menuLabel="Menu"
      >
        <p>Page content</p>
      </SiteShell>,
    );

    expect(screen.getByRole('link', { name: 'Ihab Khaled' })).toBeInTheDocument();
    expect(screen.getByText('Desktop nav')).toBeInTheDocument();
    expect(screen.getByText('Mobile nav')).toBeInTheDocument();
    expect(screen.getByText('Controls')).toBeInTheDocument();
    expect(screen.getByText('Download CV')).toBeInTheDocument();
    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(screen.getByText('Footer note')).toBeInTheDocument();
    expect(screen.getByText('Footer nav')).toBeInTheDocument();
    expect(screen.getByText('Footer social')).toBeInTheDocument();
    expect(screen.getAllByRole('navigation', { name: 'Main navigation' })).toHaveLength(3);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });
});

describe('TEST_IDS', () => {
  it('keeps the appHeader id stable for the Playwright home e2e spec', () => {
    expect(TEST_IDS.appHeader).toBe('app-header');
  });
});
