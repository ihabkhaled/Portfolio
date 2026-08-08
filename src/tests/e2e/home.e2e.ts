import { expect, test } from '@playwright/test';

import { TEST_IDS } from '@/shared/constants/test-ids.constants';

test.describe('home page', () => {
  test('renders the hero, header, and footer landmarks', async ({ page }) => {
    await page.goto('/en');

    const main = page.locator('#main-content');

    await expect(page.getByRole('heading', { level: 1, name: 'Ihab Khaled' })).toBeVisible();
    await expect(main.getByText('Senior Software Engineer', { exact: true })).toBeVisible();
    await expect(
      main.getByText('I architect, build, integrate, test and deploy production software.'),
    ).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.appHeader)).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('renders the cover matching the active locale above the name', async ({ page }) => {
    await page.goto('/en');

    const englishCover = page.getByRole('img', {
      name: /Ihab Khaled.*Senior Software Engineer/iu,
    });
    await expect(englishCover).toHaveAttribute('src', /%2Fsocial%2Fen\.png/u);
    await expect(englishCover).toHaveAttribute('width', '1200');
    await expect(englishCover).toHaveAttribute('height', '630');

    await page.goto('/ar');

    const arabicCover = page.locator('img[src*="%2Fsocial%2Far.png"]');
    await expect(arabicCover).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('navigates to projects through the primary call to action', async ({ page }) => {
    await page.goto('/en');

    await page.getByRole('link', { name: 'View projects' }).click();

    await expect(page).toHaveURL('/en/projects');
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
  });

  test('featured projects on the home page link to their case studies', async ({ page }) => {
    await page.goto('/en');

    await page.getByRole('link', { name: /ClawAI/u }).click();

    await expect(page).toHaveURL('/en/projects/clawai');
    await expect(page.getByRole('heading', { level: 1, name: 'ClawAI' })).toBeVisible();
  });

  test('unknown routes render the translated not-found page', async ({ page }) => {
    await page.goto('/en/definitely-not-a-route');

    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();

    await page.getByRole('link', { name: 'Back to home' }).click();

    await expect(page).toHaveURL('/');
  });
});
