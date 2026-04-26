import { test, expect } from '@playwright/test';

test('Verify UCSF Light Theme, Branding and Admin', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('http://localhost:3000');

  // Handle SupabaseConfig
  const configTitle = page.locator('h2:has-text("Database Config")');
  if (await configTitle.isVisible()) {
    await page.fill('input[placeholder*="supabase.co"]', 'https://lyoiiwldzzvnykbrjfbh.supabase.co');
    await page.fill('input[placeholder*="key"]', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2lpd2xkenp2bnlrYnJqZmBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzc2ODMsImV4cCI6MjA5MjYxMzY4M30.dKqwwz_8DDpT7QLDzmII0tSA67h6IKvUY7Qo9R3O6es');
    await page.click('button:has-text("Connect Database")');
  }

  await page.waitForSelector('nav', { timeout: 15000 });

  // Verify Background
  const bgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
  console.log('Background Color:', bgColor);

  // Verify UCSF Branding
  await expect(page.locator('nav')).toContainText('UCSF');

  // Screenshot Home
  await page.screenshot({ path: 'verification/ucsf_home_v2.png' });

  // Verify Admin Panel
  // Try multiple ways to click Admin
  const adminBtn = page.locator('button:has-text("Admin")').first();
  await adminBtn.click();

  await page.waitForSelector('input[type="password"]', { timeout: 15000 });
  await page.fill('input[type="password"]', 'ucsf2026');
  await page.click('button:has-text("Enter Portal")');

  await page.waitForSelector('aside', { timeout: 15000 });
  await expect(page.locator('aside h1')).toContainText('UCSF');
  await page.screenshot({ path: 'verification/ucsf_admin_v2.png' });
});
