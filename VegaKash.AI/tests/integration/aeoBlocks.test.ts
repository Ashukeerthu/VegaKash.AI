import { test, expect } from '@playwright/test';

test.describe('AEO Blocks', () => {
  test('Direct answer block renders correctly', async ({ page }) => {
    await page.goto('/tools/emi');

    const directAnswer = await page.locator('.aeo-direct-answer .aeo-result').innerText();
    expect(directAnswer).toContain('Monthly EMI');

    const summary = await page.locator('.aeo-summary').innerText();
    expect(summary).not.toBe('');
  });

  test('JSON-LD schema is present', async ({ page }) => {
    await page.goto('/tools/emi');

    const jsonLd = await page.locator('script[type="application/ld+json"]').innerText();
    expect(jsonLd).toContain('FinancialProduct');
  });
});