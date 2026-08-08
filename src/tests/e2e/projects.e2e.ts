import { expect, test } from '@playwright/test';

test.describe('projects page', () => {
  test('filter chips narrow the list and track the active category', async ({ page }) => {
    await page.goto('/en/projects');

    const filterGroup = page.getByRole('group', { name: 'Filter projects by category' });
    const allChip = filterGroup.getByRole('button', { name: 'All' });
    const backendChip = filterGroup.getByRole('button', { name: 'Backend' });

    await expect(allChip).toHaveAttribute('aria-pressed', 'true');
    await expect(backendChip).toHaveAttribute('aria-pressed', 'false');

    await backendChip.click();

    await expect(backendChip).toHaveAttribute('aria-pressed', 'true');
    await expect(allChip).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible();
  });

  test('opens a case study with breadcrumb navigation back to the list', async ({ page }) => {
    await page.goto('/en/projects');

    await page.getByRole('link', { name: /ClawAI/u }).click();

    await expect(page).toHaveURL('/en/projects/clawai');
    await expect(page.getByRole('heading', { level: 1, name: 'ClawAI' })).toBeVisible();

    const repoLink = page.getByRole('link', { name: 'Repository' });
    await expect(repoLink).toHaveAttribute('target', '_blank');
    await expect(repoLink).toHaveAttribute('rel', 'noopener noreferrer');

    await page.getByRole('link', { name: 'All projects' }).click();
    await expect(page).toHaveURL('/en/projects');
  });

  test('a professional project case study renders without a public repository link', async ({
    page,
  }) => {
    await page.goto('/en/projects');

    await page.getByRole('link', { name: /myoncare/iu }).click();

    await expect(page).toHaveURL('/en/projects/myoncare');
    await expect(page.getByRole('heading', { level: 1, name: 'myoncare' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Repository' })).toHaveCount(0);
  });

  test('an open-source project without a live URL only offers a repository link', async ({
    page,
  }) => {
    await page.goto('/en/projects/nextranger');

    await expect(page.getByRole('heading', { level: 1, name: 'NextRanger' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Repository' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Live site' })).toHaveCount(0);
  });

  test('an unknown project slug renders the translated not-found page', async ({ page }) => {
    const response = await page.goto('/en/projects/does-not-exist');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });
});
