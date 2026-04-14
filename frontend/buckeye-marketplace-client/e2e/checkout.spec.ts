import { test, expect } from '@playwright/test';

test('full happy path: register → login → browse → add to cart → checkout → order history', async ({ page }, testInfo) => {
  const email = `testuser${Date.now()}@test.com`;
  const password = 'Test1234';
  const name = 'Test User';

  // 1. Go to home page
  await page.goto('/');
  await page.screenshot({ path: testInfo.outputPath('01-home.png'), fullPage: true });
  await expect(page.getByRole('heading', { name: 'Buckeye Marketplace' })).toBeVisible();

  // 2. Navigate to register
  await page.getByRole('link', { name: 'Log In' }).click();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.screenshot({ path: testInfo.outputPath('02-register-page.png'), fullPage: true });

  // 3. Register a new user
  await page.getByLabel('Name').fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForURL('/');
  await page.screenshot({ path: testInfo.outputPath('03-after-register.png'), fullPage: true });

  // 4. Verify logged in — name should appear in header
  await expect(page.getByText(name)).toBeVisible();

  // 5. Browse products
  await expect(page.getByRole('heading', { name: 'Heels' }).first()).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('04-products-visible.png'), fullPage: true });

  // 6. Add item to cart
  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
  await expect(page.getByText('1 items')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('05-after-add-to-cart.png'), fullPage: true });

  // 7. Go to checkout
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.waitForURL('/checkout');
  await page.screenshot({ path: testInfo.outputPath('06-checkout-page.png'), fullPage: true });

  // 8. Fill shipping address and place order
  await page.getByLabel('Shipping Address').fill('123 Main St, Columbus, OH 43210');
  await page.getByRole('button', { name: 'Place Order' }).click();
  await page.waitForURL(/order-confirmation/);
  await page.screenshot({ path: testInfo.outputPath('07-order-confirmation.png'), fullPage: true });

  // 9. Verify confirmation page
  await expect(page.getByText('Order Confirmed!')).toBeVisible();
  await expect(page.getByText(/BM-/)).toBeVisible();

  // 10. Navigate to order history
  await page.getByRole('link', { name: 'View My Orders' }).click();
  await page.waitForURL('/orders');
  await page.screenshot({ path: testInfo.outputPath('08-order-history.png'), fullPage: true });

  // 11. Verify order appears in history
  await expect(page.getByText(/BM-/)).toBeVisible();
  await expect(page.getByText('Pending')).toBeVisible();
  await expect(page.getByText('$15.00').first()).toBeVisible();
});