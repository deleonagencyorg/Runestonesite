import { test, expect } from '@playwright/test';

test.describe('Runestone smoke', () => {
  test('home loads with dual CTAs, process, and lead form', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('site-header')).toBeVisible();
    await expect(page.getByTestId('home-hero')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Build with purpose/i);

    const ctas = page.getByTestId('cta-group').first();
    await expect(ctas.getByRole('link', { name: /Call/i })).toBeVisible();
    await expect(ctas.getByRole('link', { name: /Tell Us About Your Project/i })).toBeVisible();

    await expect(page.getByTestId('process-section')).toBeVisible();
    await expect(page.getByTestId('services-section')).toBeVisible();
    await expect(page.getByTestId('lead-form')).toBeVisible();
  });

  test('primary pages resolve', async ({ page }) => {
    for (const path of ['/about', '/services', '/projects', '/blog', '/contact', '/es']) {
      const res = await page.goto(path);
      expect(res?.ok()).toBeTruthy();
      await expect(page.locator('main h1')).toBeVisible();
    }
  });

  test('blog article from markdown renders', async ({ page }) => {
    await page.goto('/blog/planning-custom-home-southwest-florida');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Planning a Custom Home/i);
    await expect(page.locator('article')).toContainText(/Runestone Construction/i);
  });

  test('project detail shows gallery and testimonial', async ({ page }) => {
    await page.goto('/projects/naples-waterfront-residence');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Naples Waterfront/i);
    await expect(page.getByTestId('project-gallery')).toBeVisible();
    await expect(page.getByText(/Clear communication/i)).toBeVisible();
  });

  test('process scroll scrub advances labels', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const label = page.getByTestId('process-label');
    await page.getByTestId('process-section').scrollIntoViewIfNeeded();
    await expect(label).toBeVisible();

    await page.evaluate(() => {
      const root = document.querySelector('[data-process-root]');
      if (!root) return;
      const top = root.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + window.innerHeight * 3);
    });
    await page.waitForTimeout(400);
    await expect(label).not.toHaveText(/01 — Consultation/);
  });

  test('lead form submits in mock mode', async ({ page }) => {
    await page.goto('/contact');

    const form = page.getByTestId('lead-form');
    await form.getByLabel('Name *').fill('Test Lead');
    await form.getByLabel('Email *').fill('lead@example.com');
    await form.getByLabel('Phone *').fill('2395550100');
    await form.getByLabel('Message *').fill('Interested in a custom home in Naples.');
    await form.getByText(/I agree to be contacted/i).click();
    await form.getByRole('button', { name: /Let’s Build Something Exceptional/i }).click();

    await expect(page.getByTestId('lead-success')).toBeVisible();
  });
});
