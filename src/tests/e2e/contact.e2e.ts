import { expect, test } from '@playwright/test';

test.describe('contact page', () => {
  test('renders direct contact channels as safe external links', async ({ page }) => {
    await page.goto('/en/contact');

    await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible();

    const emailLink = page.getByRole('link', { name: 'ihab.khaled94@gmail.com' });
    await expect(emailLink).toHaveAttribute('href', 'mailto:ihab.khaled94@gmail.com');

    await expect(page.getByText('https://github.com/ihabkhaled')).toBeVisible();

    const githubLink = page.getByRole('contentinfo').getByRole('link', { name: 'GitHub' });
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/ihabkhaled');
  });

  test('the copy-email button copies the address to the clipboard', async ({ page, context }) => {
    await page.goto('/en/contact');
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: new URL(page.url()).origin,
    });

    await page.getByRole('button', { name: 'Copy email address' }).click();

    await expect(page.getByText('Email address copied')).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('ihab.khaled94@gmail.com');
  });

  test('the browser blocks submission of an incomplete form', async ({ page }) => {
    await page.goto('/en/contact');

    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page).toHaveURL('/en/contact');
    await expect(page.locator('#contact-email:invalid')).toHaveCount(1);
  });

  test('a successful submission shows the confirmation and resets the form', async ({ page }) => {
    await page.goto('/en/contact');
    await page.route('**/api/contact', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.fulfill({ status: 201, json: { sent: true } });
    });

    await page.getByLabel('Your email address').fill('visitor@example.com');
    await page.getByLabel('Subject').fill('Freelance enquiry');
    await page.getByLabel('Message').fill('Hello, I would like to discuss a project with you.');
    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    await expect(
      page.getByText('Message sent. I will reply to the address you gave.'),
    ).toBeVisible();
    await expect(page.getByLabel('Your email address')).toHaveValue('');
  });

  test('a 503 response tells the visitor to email directly instead', async ({ page }) => {
    await page.goto('/en/contact');
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({ status: 503, json: { error: 'unavailable' } });
    });

    await page.getByLabel('Your email address').fill('visitor@example.com');
    await page.getByLabel('Subject').fill('Freelance enquiry');
    await page.getByLabel('Message').fill('Hello, I would like to discuss a project with you.');
    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(
      page.getByText('The message form is not available right now. Please email me directly.'),
    ).toBeVisible();
  });
});
