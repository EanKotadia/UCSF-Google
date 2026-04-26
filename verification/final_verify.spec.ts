import { test, expect } from '@playwright/test';

test('verify homepage and admin login', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await page.screenshot({ path: 'verification/homepage_maple.png' });

  await page.click('text=Admin');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification/admin_login_maple.png' });

  // Enter password to see panel
  await page.fill('input[placeholder="Access Key"]', 'ucsf2026');
  await page.click('button:has-text("Authorize Access")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verification/admin_panel_maple.png', fullPage: true });
});
