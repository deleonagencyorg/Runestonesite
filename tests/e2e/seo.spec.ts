import { test, expect } from '@playwright/test';

const pages = ['/', '/about', '/services', '/gallery', '/blog', '/contact'];

test.describe('search and answer metadata', () => {
  for (const path of pages) {
    test(`${path} has a unique title, description, canonical, and contractor schema`, async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(15);
      expect(title.length).toBeLessThan(80);
      expect(title).toMatch(/Runestone/);

      const description = page.locator('meta[name="description"]');
      const content = await description.getAttribute('content');
      expect(content && content.length).toBeGreaterThan(80);
      expect(content).toMatch(/Southwest Florida|Fort Myers|Naples/);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /runestoneconstruction\.com/);
      await expect(page.locator('meta[name="keywords"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https?:\/\//);

      const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
      expect(jsonLd).toContain('GeneralContractor');
      expect(jsonLd).toContain('CGC1540643');
    });
  }

  test('home answers the questions a buyer would ask', async ({ page }) => {
    await page.goto('/');
    const faq = page.getByTestId('faq');
    await expect(faq.getByText('What does Runestone Construction build?')).toBeVisible();
    await faq.locator('details').first().click();
    await expect(faq).toContainText('CGC1540643');
    await expect(faq).toContainText('Naples, Fort Myers, Cape Coral');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toContain('FAQPage');
  });

  test('thin locale and placeholder projects stay out of the index', async ({ page }) => {
    await page.goto('/es');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await page.goto('/projects');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});
