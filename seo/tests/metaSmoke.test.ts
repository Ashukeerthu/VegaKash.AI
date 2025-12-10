import { test, expect } from '@playwright/test';

test.describe('Meta Smoke Tests', () => {
  test('Key pages return HTTP 200 and meta tags exist', async ({ page }) => {
    const urls = [
      '/',
      '/tools/emi',
      '/tools/sip'
    ];

    for (const url of urls) {
      await page.goto(url);

      // Check HTTP status
      const response = await page.waitForResponse(url);
      expect(response.status()).toBe(200);

      // Check meta tags
      const title = await page.title();
      expect(title).not.toBe('');

      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).not.toBeNull();

      const jsonLd = await page.locator('script[type="application/ld+json"]').innerText();
      expect(jsonLd).not.toBeNull();
    }
  });
});