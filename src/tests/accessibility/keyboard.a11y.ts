import { expect, test } from '@playwright/test';

test.describe('keyboard operability', () => {
  test('the skip link is the first tab stop and jumps to main content', async ({ page }) => {
    await page.goto('/en');

    await page.keyboard.press('Tab');

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });

    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/#main-content$/u);
  });

  test('the primary navigation is reachable and operable from the keyboard', async ({ page }) => {
    await page.goto('/en');

    const primaryNav = page.locator('header').getByRole('navigation', { name: 'Primary' }).first();
    await primaryNav.getByRole('link', { name: 'Experience' }).focus();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL('/en/experience');
  });

  test('the theme control is operable from the keyboard', async ({ page }) => {
    await page.goto('/en');

    const html = page.locator('html');
    const themeButton = page.getByRole('button', { name: /Change colour theme/u });
    const themeBefore = await html.getAttribute('data-theme');
    const labelBefore = await themeButton.getAttribute('aria-label');

    await themeButton.focus();
    await page.keyboard.press('Enter');

    await expect(html).not.toHaveAttribute('data-theme', themeBefore ?? '');
    await expect(themeButton).not.toHaveAttribute('aria-label', labelBefore ?? '');
  });

  test('the mobile menu opens and exposes every link to the keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en');

    const mobileMenu = page.locator('header details');
    await mobileMenu.locator('summary').focus();
    await page.keyboard.press('Enter');

    await expect(mobileMenu).toHaveJSProperty('open', true);

    const mobileNav = mobileMenu.getByRole('navigation', { name: 'Primary' });
    for (const label of [
      'Home',
      'Experience',
      'Projects',
      'Skills',
      'About',
      'Resume',
      'Contact',
    ]) {
      await expect(mobileNav.getByRole('link', { name: label })).toBeVisible();
    }
  });

  test('the contact form can be filled and submitted entirely from the keyboard', async ({
    page,
  }) => {
    await page.goto('/en/contact');
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({ status: 201, json: { sent: true } });
    });

    await page.getByLabel('Your email address').focus();
    await page.keyboard.type('visitor@example.com');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Freelance enquiry');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Hello, I would like to discuss a project with you.');
    await page.keyboard.press('Tab');

    await expect(page.getByRole('button', { name: 'Send message' })).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(
      page.getByText('Message sent. I will reply to the address you gave.'),
    ).toBeVisible();
  });
});
