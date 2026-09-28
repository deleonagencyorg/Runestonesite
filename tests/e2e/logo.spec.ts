import { test, expect } from '@playwright/test';

const pages = ['/', '/about', '/services', '/gallery', '/contact'];

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test.describe(`logo and layout ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const path of pages) {
      test(`${path} shows the official logo without overflow`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));

        const response = await page.goto(path);
        expect(response?.ok()).toBeTruthy();

        const headerLogo = page.getByRole('banner').getByRole('img', { name: /Runestone Construction/i });
        const footerLogo = page.getByRole('contentinfo').getByRole('img', { name: /Runestone Construction/i });
        await expect(headerLogo).toBeVisible();
        await expect(footerLogo).toBeVisible();
        await expect(headerLogo).toHaveAttribute('src', '/brand/runestone-logo.png');
        await expect(footerLogo).toHaveAttribute('src', '/brand/runestone-logo-on-dark.png');

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
        );
        expect(overflow).toBeTruthy();
        expect(errors).toEqual([]);
      });
    }

    test('mobile menu opens when the viewport is narrow', async ({ page }) => {
      test.skip(viewport.name !== 'mobile', 'menu is only for narrow screens');
      await page.goto('/');
      const menu = page.getByTestId('site-header').getByRole('button', { name: 'Menu' });
      await menu.click();
      await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
      await expect(page.getByTestId('site-header').getByRole('link', { name: 'Gallery' })).toBeVisible();
    });
  });
}
