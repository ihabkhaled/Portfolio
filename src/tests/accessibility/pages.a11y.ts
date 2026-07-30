import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const BLOCKING_IMPACTS = new Set(['serious', 'critical']);

const PUBLIC_ROUTES = [
  { name: 'Home', path: '/en' },
  { name: 'Experience', path: '/en/experience' },
  { name: 'Projects', path: '/en/projects' },
  { name: 'Skills', path: '/en/skills' },
  { name: 'About', path: '/en/about' },
  { name: 'Resume', path: '/en/resume' },
  { name: 'Contact', path: '/en/contact' },
  { name: 'Case study', path: '/en/projects/clawai' },
  { name: 'Offline fallback', path: '/en/offline' },
] as const;

async function expectNoBlockingViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) =>
    BLOCKING_IMPACTS.has(violation.impact ?? ''),
  );

  expect(
    blocking.flatMap((violation) =>
      violation.nodes.map(
        (node) =>
          `${violation.id} ${node.target.join(' ')}: ${node.failureSummary ?? violation.description}`,
      ),
    ),
  ).toEqual([]);
}

test.describe('axe scans', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.name} page has no serious or critical violations`, async ({ page }) => {
      await page.goto(route.path);
      await expectNoBlockingViolations(page);
    });
  }

  test('the Arabic home page has no serious or critical violations in RTL', async ({ page }) => {
    await page.goto('/ar');
    await expectNoBlockingViolations(page);
  });

  test('the mobile navigation menu has no serious or critical violations when open', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en');

    await page.locator('header details summary').click();

    await expectNoBlockingViolations(page);
  });

  test('the contact form in its validation-error state has no serious or critical violations', async ({
    page,
  }) => {
    await page.goto('/en/contact');

    await page.getByRole('button', { name: 'Send message' }).click();

    await expectNoBlockingViolations(page);
  });
});
