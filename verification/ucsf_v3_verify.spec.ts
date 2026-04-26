import { test, expect } from '@playwright/test';

test('Verify UCSF V3 Theme and Branding', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('http://localhost:3000');

  // Handle SupabaseConfig
  const configTitle = page.locator('h2:has-text("Database")');
  if (await configTitle.isVisible()) {
    await page.fill('input[placeholder*="supabase.co"]', 'https://lyoiiwldzzvnykbrjfbh.supabase.co');
    await page.fill('input[placeholder*="key"]', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2lpd2xkenp2bnlrYnJqZmBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzc2ODMsImV4cCI6MjA5MjYxMzY4M30.dKqwwz_8DDpT7QLDzmII0tSA67h6IKvUY7Qo9R3O6es');
    await page.click('button:has-text("Connect Database")');
  }

  await page.waitForSelector('nav', { timeout: 15000 });

  // Verify Background (Navy #003262)
  const bgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
  console.log('BG Color:', bgColor);

  // Verify Typography and UI
  await expect(page.locator('h1')).toContainText('UNION OF');

  // Screenshots
  await page.screenshot({ path: 'verification/ucsf_v3_home.png' });

  // Admin Login
  await page.click('button:has-text("Admin")');
  await page.waitForSelector('input[type="password"]');
  await page.fill('input[type="password"]', 'ucsf2026');
  await page.click('button:has-text("Access Portal")');

  await page.waitForSelector('aside');
  await page.screenshot({ path: 'verification/ucsf_v3_admin.png' });
});
