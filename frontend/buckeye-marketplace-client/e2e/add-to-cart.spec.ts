import { test, expect } from '@playwright/test';

test('browse products and add one to cart', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.screenshot({ path: testInfo.outputPath('01-home.png'), fullPage: true });

  await expect(page.getByRole('heading', { name: 'Buckeye Marketplace' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Heels' }).first()).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('02-products-visible.png'), fullPage: true });

  const summary = page.getByText(/items/).first();
  const initialSummaryText = await summary.textContent();
  const initialCount = Number(initialSummaryText?.match(/(\d+) items/)?.[1] ?? 0);

  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  await page.screenshot({ path: testInfo.outputPath('03-after-add-to-cart.png'), fullPage: true });

  await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
  await expect(page.getByRole('complementary').getByRole('heading', { name: 'Heels' })).toBeVisible();
  await expect(page.getByText(/Total:/)).toBeVisible();
  await expect(summary).toContainText(`${initialCount + 1} items`);
});
