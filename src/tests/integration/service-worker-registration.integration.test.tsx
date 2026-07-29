import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ServiceWorkerRegistrationContainer } from '@/modules/pwa';
import { UiPreferencesEffects } from '@/modules/ui-preferences';
import * as browserPackage from '@/packages/browser';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ServiceWorkerRegistrationContainer', () => {
  it('registers the service worker at /sw.js on mount and renders nothing', () => {
    const registerSpy = vi
      .spyOn(browserPackage, 'registerAppServiceWorker')
      .mockResolvedValue(null);

    const { container } = render(<ServiceWorkerRegistrationContainer />);

    expect(registerSpy).toHaveBeenCalledWith('/sw.js');
    expect(container).toBeEmptyDOMElement();
  });
});

describe('UiPreferencesEffects', () => {
  it('mounts the preference side effects and renders nothing', () => {
    const { container } = render(<UiPreferencesEffects />);

    expect(container).toBeEmptyDOMElement();
    expect(document.documentElement.dataset['theme']).not.toBeNull();
  });
});
