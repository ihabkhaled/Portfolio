import { expect, test } from '@playwright/test';

test.describe('localized URL and RTL contracts', () => {
  test('the bare origin serves the default English page without redirecting', async ({
    page,
    request,
  }) => {
    const response = await request.get('/', { maxRedirects: 0 });

    expect(response.status()).toBe(200);
    expect(response.headers()['location']).toBeUndefined();

    await page.goto('/');

    await expect(page).toHaveURL(/\/$/u);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en$/u);
    await expect(page.getByRole('heading', { name: 'Ihab Khaled', level: 1 })).toBeVisible();
  });

  test('the Arabic URL is an independently crawlable RTL page', async ({ page }) => {
    await page.goto('/ar');

    await expect(page).toHaveURL('/ar');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/ar$/u);
  });

  test('the Persian URL also renders as an independently crawlable RTL page', async ({ page }) => {
    await page.goto('/fa');

    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('the language switcher preserves the current route and hash', async ({ page }) => {
    await page.goto('/en/about#top');

    await page.getByRole('combobox', { name: 'Change language' }).selectOption('ar');

    await expect(page).toHaveURL('/ar/about#top');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('unsupported locale segments return a real not-found response', async ({ page }) => {
    const response = await page.goto('/xx');

    expect(response?.status()).toBe(404);
  });
});
