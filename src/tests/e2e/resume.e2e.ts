import { expect, test } from '@playwright/test';

test.describe('resume page', () => {
  test('offers a reachable PDF download of the CV', async ({ page, request }) => {
    await page.goto('/en/resume');

    await expect(page.getByRole('heading', { level: 1, name: 'Resume' })).toBeVisible();

    const downloadLink = page.locator('#main-content').getByRole('link', { name: 'Download CV' });
    await expect(downloadLink).toHaveAttribute('href', '/ihab-khaled-cv.pdf');
    await expect(downloadLink).toHaveAttribute('target', '_blank');

    const pdfResponse = await request.get('/ihab-khaled-cv.pdf');
    expect(pdfResponse.ok()).toBe(true);
    expect(pdfResponse.headers()['content-type']).toContain('application/pdf');
  });

  test('the print stylesheet hides site chrome and the download call-to-action', async ({
    page,
  }) => {
    await page.goto('/en/resume');
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('header')).toBeHidden();
    await expect(page.locator('footer')).toBeHidden();
    await expect(
      page.locator('#main-content').getByRole('link', { name: 'Download CV' }),
    ).toBeHidden();
    await expect(page.getByRole('heading', { level: 1, name: 'Resume' })).toBeVisible();
  });
});
