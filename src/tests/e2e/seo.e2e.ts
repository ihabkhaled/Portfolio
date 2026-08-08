import { expect, test } from '@playwright/test';

import { SUPPORTED_LOCALES } from '@/packages/i18n';
import { INDEXABLE_PATHS, NON_INDEXABLE_PATHS } from '@/shared/constants/seo.constants';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';

const EXPECTED_CASE_STUDY_PATHS = [
  '/projects/clawai',
  '/projects/auraspear',
  '/projects/foodorder',
  '/projects/twinzyai',
  '/projects/nextranger',
  '/projects/myoncare',
  '/projects/garment-io',
  '/projects/tarsyaa',
  '/projects/ovarc',
  '/projects/callrater',
  '/projects/vms',
  '/projects/health-integrations',
  '/projects/payment-integrations',
] as const;

test.describe('search and social discovery', () => {
  test('publishes complete localized metadata and a reachable social image', async ({
    page,
    request,
  }) => {
    await page.goto('/fr/about');

    await expect(page).toHaveTitle(/Ihab Khaled/u);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/u);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/fr\/about$/u);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(
      SUPPORTED_LOCALES.length + 1,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /index,\s*follow/iu,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'fr_FR');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await expect(page.locator('meta[name="google-adsense-account"]')).toHaveAttribute(
      'content',
      'ca-pub-2415314275784926',
    );
    const socialImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    const socialImageAlt = await page
      .locator('meta[property="og:image:alt"]')
      .getAttribute('content');
    expect(socialImage).toMatch(/\/social\/fr\.png$/u);
    expect(socialImageAlt).toMatch(/Ihab Khaled/u);

    const imageResponse = await request.get(socialImage ?? '');
    expect(imageResponse.ok()).toBe(true);
    expect(imageResponse.headers()['content-type']).toContain('image/png');
    expect(await imageResponse.body()).not.toHaveLength(0);
  });

  test('every locale publishes a reachable, correctly typed social image', async ({ request }) => {
    for (const locale of SUPPORTED_LOCALES) {
      const localizedImageResponse = await request.get(`/social/${locale}.png`);
      expect(localizedImageResponse.ok()).toBe(true);
      expect(localizedImageResponse.headers()['content-type']).toContain('image/png');
    }
  });

  test('publishes Person and WebSite structured data on every page', async ({ page }) => {
    await page.goto('/en');

    const jsonLdBlocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = jsonLdBlocks.map((block) => JSON.parse(block) as Record<string, unknown>);

    expect(parsed).toContainEqual(expect.objectContaining({ '@type': 'Person' }));
    expect(parsed).toContainEqual(expect.objectContaining({ '@type': 'WebSite' }));
  });

  test('publishes BreadcrumbList and SoftwareSourceCode structured data on a case study', async ({
    page,
  }) => {
    await page.goto('/en/projects/clawai');

    const jsonLdBlocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = jsonLdBlocks.map((block) => JSON.parse(block) as Record<string, unknown>);

    expect(parsed).toContainEqual(expect.objectContaining({ '@type': 'BreadcrumbList' }));
    expect(parsed).toContainEqual(expect.objectContaining({ '@type': 'SoftwareSourceCode' }));
  });

  test('marks the PWA offline fallback noindex and nofollow in every locale', async ({ page }) => {
    for (const path of NON_INDEXABLE_PATHS) {
      await page.goto(buildLocalizedPath('en', path));
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        /noindex,\s*nofollow/iu,
      );
    }
  });

  test('publishes a complete sitemap while shielding utility routes and the API from crawlers', async ({
    request,
  }) => {
    const robotsResponse = await request.get('/robots.txt');
    const sitemapResponse = await request.get('/sitemap.xml');
    const adsTextResponse = await request.get('/ads.txt');
    const robotsText = await robotsResponse.text();
    const sitemapText = await sitemapResponse.text();

    expect(robotsResponse.ok()).toBe(true);
    expect(sitemapResponse.ok()).toBe(true);
    expect(adsTextResponse.ok()).toBe(true);
    expect(await adsTextResponse.text()).toBe(
      'google.com, pub-2415314275784926, DIRECT, f08c47fec0942fa0\n',
    );
    expect(robotsText).toContain('Allow: /ads.txt');
    expect(robotsText).toContain('Allow: /sitemap.xml');
    expect(robotsText).toContain('Allow: /social/');
    expect(robotsText).toContain('Disallow: /api/');
    expect(robotsText).toContain('Disallow: /en/offline');
    expect(robotsText).toContain('Disallow: /ar/offline');
    expect(sitemapText.match(/<url>/gu)).toHaveLength(
      (INDEXABLE_PATHS.length + EXPECTED_CASE_STUDY_PATHS.length) * SUPPORTED_LOCALES.length,
    );
    for (const locale of SUPPORTED_LOCALES) {
      for (const path of [...INDEXABLE_PATHS, ...EXPECTED_CASE_STUDY_PATHS]) {
        expect(sitemapText).toContain(buildLocalizedPath(locale, path));
      }
    }
    expect(sitemapText).not.toContain('/en/offline');
  });
});
