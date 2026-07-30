import { expect, test, type Locator, type Page } from '@playwright/test';

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
} as const;

async function goToReady(page: Page, path: string, ready: Locator): Promise<void> {
  await page.goto(path);
  await expect(ready).toBeVisible();
}

test.describe('visual baselines', () => {
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    test(`home ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await goToReady(page, '/en', page.getByRole('heading', { level: 1, name: 'Ihab Khaled' }));

      await expect(page).toHaveScreenshot(`home-${name}.png`, { fullPage: true });
    });
  }

  test('home desktop RTL', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await goToReady(page, '/ar', page.getByRole('heading', { level: 1 }));

    await expect(page).toHaveScreenshot('home-desktop-ar.png', { fullPage: true });
  });

  test('home desktop dark theme', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await goToReady(page, '/en', page.getByRole('heading', { level: 1, name: 'Ihab Khaled' }));

    const html = page.locator('html');
    const themeBefore = await html.getAttribute('data-theme');
    await page.getByRole('button', { name: /Change colour theme/u }).click();
    await expect(html).not.toHaveAttribute('data-theme', themeBefore ?? '');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await expect(page).toHaveScreenshot('home-desktop-dark.png', { fullPage: true });
  });

  test('about desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await goToReady(page, '/en/about', page.getByRole('heading', { level: 1, name: 'About' }));

    await expect(page).toHaveScreenshot('about-desktop.png', { fullPage: true });
  });

  test('projects desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await goToReady(
      page,
      '/en/projects',
      page.getByRole('heading', { level: 1, name: 'Projects' }),
    );

    await expect(page).toHaveScreenshot('projects-desktop.png', { fullPage: true });
  });

  test('resume desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await goToReady(page, '/en/resume', page.getByRole('heading', { level: 1, name: 'Resume' }));

    await expect(page).toHaveScreenshot('resume-desktop.png', { fullPage: true });
  });

  test('contact desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await goToReady(page, '/en/contact', page.getByRole('heading', { level: 1, name: 'Contact' }));

    await expect(page).toHaveScreenshot('contact-desktop.png', { fullPage: true });
  });
});
