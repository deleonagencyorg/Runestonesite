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
    for (const path of ['/about', '/services', '/gallery', '/blog', '/contact', '/es']) {
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

  test('gallery opens from home and shows the residence in order', async ({ page }) => {
    await page.goto('/');
    const section = page.getByTestId('gallery-section');
    await expect(section.getByRole('heading', { level: 2 })).toContainText(/price your own/i);
    await expect(section.getByRole('link', { name: /View the gallery/i })).toBeVisible();
    await expect(section.getByRole('link', { name: /Request a quote/i })).toHaveAttribute('href', '#lead-form');
    await expect(section.locator('img')).toHaveCount(1);
    await section.getByRole('link', { name: /View the gallery/i }).click();

    await expect(page).toHaveURL(/\/gallery$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/From the roof/i);
    const images = page.getByTestId('residence-gallery').locator('img');
    await expect(images.first()).toHaveAttribute('alt', /Aerial Front Exterior 2$/i);
    await expect(images.nth(10)).toHaveAttribute('alt', /Aerial Rear Exterior 3 - marker/i);
    await expect(images.nth(11)).toHaveAttribute('alt', /Front Exterior 1 of 3 -Dusk/i);
    await expect(page.getByTestId('residence-rail')).toHaveAttribute('data-gallery-ready', 'true');
    await expect(page.getByTestId('gallery-caption')).toHaveText(/Aerial Front Exterior 2$/i);
    await page.getByRole('button', { name: 'Next photograph' }).click();
    await expect(page.getByTestId('gallery-caption')).toHaveText(/Aerial Front Exterior 2 - marker/i);
    await expect(page.getByRole('link', { name: /Request a quote/i }).first()).toBeVisible();
  });

  test('each process phase shows its title and description', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.locator('[data-process-video]').evaluate(async (node) => {
      const video = node as HTMLVideoElement;
      if (video.readyState >= 1) return;
      await new Promise<void>((resolve) => {
        video.addEventListener('loadedmetadata', () => resolve(), { once: true });
      });
    });

    const pinStart = await page.evaluate(() => {
      window.scrollTo(0, 0);
      const root = document.querySelector('[data-process-root]');
      if (!root) return 0;
      return root.getBoundingClientRect().top + window.scrollY;
    });

    const steps = [
      'Consultation & Project Discovery',
      'Site Evaluation & Feasibility',
      'Design & Pre-Construction',
      'Permitting & Approvals',
      'Construction',
      'Quality Control & Inspections',
      'Final Walkthrough & Completion',
      'Project Delivery',
    ];

    for (const [index, title] of steps.entries()) {
      await page.evaluate(
        ({ step, start }) => {
          const mobile = window.matchMedia('(max-width: 767px)').matches;
          const len = Math.round(window.innerHeight * 9 * (mobile ? 0.7 : 0.9));
          window.scrollTo(0, start + len * ((step + 1.5) / 9));
        },
        { step: index, start: pinStart },
      );

      const active = page.locator('.slide.is-active');
      await expect(active.locator('.title-inner')).toHaveText(title);
      await expect(active.locator('.phase')).toBeVisible();
      await expect(active.locator('.desc')).toBeVisible();
      await expect(page.locator('.mast-title')).toBeVisible();
      await expect(active.locator('.title-inner')).toBeVisible();

      await expect
        .poll(async () =>
          page.evaluate(() => {
            const slide = document.querySelector('.slide.is-active');
            const titleBox = slide?.querySelector('.title-inner')?.getBoundingClientRect();
            const descBox = slide?.querySelector('.desc')?.getBoundingClientRect();
            const desc = slide?.querySelector('.desc');
            if (!slide || !titleBox || !descBox || !desc) return false;
            const readable = Number(getComputedStyle(desc).opacity) > 0.9;
            const onScreen =
              titleBox.top >= 0 &&
              titleBox.bottom <= window.innerHeight &&
              descBox.top >= 0 &&
              descBox.bottom <= window.innerHeight &&
              titleBox.height > 16;
            const clear =
              titleBox.right <= descBox.left + 4 || titleBox.bottom <= descBox.top + 4;
            return readable && onScreen && clear;
          }),
        )
        .toBe(true);
    }
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
