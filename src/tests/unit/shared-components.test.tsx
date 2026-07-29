import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageHeader } from '@/shared/components/data-display/page-header.component';
import { SkipLink } from '@/shared/components/primitives/skip-link.component';
import { VisuallyHidden } from '@/shared/components/primitives/visually-hidden.component';

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
    render(<SkipLink targetHref="#main-content" label="Skip to main content" />);

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
