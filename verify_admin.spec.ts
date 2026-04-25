import { test, expect } from '@playwright/test';

test('verify admin panel login and navigation', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'verification/homepage_initial.png' });

  // Try to find any button and log its text
  const buttons = await page.locator('button').allInnerTexts();
  console.log('Buttons found:', buttons);

  // Click on the one that says Admin
  const adminButton = page.locator('button', { hasText: 'Admin' });
  await adminButton.click();

  await expect(page.locator('text=Admin Access')).toBeVisible({ timeout: 10000 });
  await page.fill('input[type="password"]', 'harmonia2026');
  await page.click('button:has-text("Authenticate")');

  await expect(page.locator('text=Committee Management')).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: 'verification/admin_committees.png' });
});
