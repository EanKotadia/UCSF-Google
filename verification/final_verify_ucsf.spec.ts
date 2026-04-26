import { test, expect } from '@playwright/test';

test('Verify UCSF Light Theme and Branding', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Handle SupabaseConfig
  const configTitle = page.locator('h2:has-text("Database Config")');
  if (await configTitle.isVisible()) {
    await page.fill('input[placeholder*="supabase.co"]', 'https://lyoiiwldzzvnykbrjfbh.supabase.co');
    await page.fill('input[placeholder*="key"]', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2lpd2xkenp2bnlrYnJqZmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzc2ODMsImV4cCI6MjA5MjYxMzY4M30.dKqwwz_8DDpT7QLDzmII0tSA67h6IKvUY7Qo9R3O6es');
    await page.click('button:has-text("Connect Database")');
  }

  await page.waitForSelector('nav', { timeout: 10000 });

  // Check background color (should be white)
  const bgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
  console.log('Background Color:', bgColor);

  // Check for UCSF branding
  await expect(page.locator('nav')).toContainText('UCSF');
  await expect(page.locator('h1')).toContainText('UNION OF');

  // Verify Admin Panel layout
  await page.click('button:has-text("Admin")');
  await page.waitForSelector('input[type="password"]');
  await page.fill('input[type="password"]', 'ucsf2026');
  await page.click('button[type="submit"]');

  await page.waitForSelector('aside');
  await expect(page.locator('aside')).toBeVisible();
  await expect(page.locator('aside h1')).toContainText('UCSF');

  // Screenshots
  await page.screenshot({ path: 'verification/ucsf_home_light.png' });
  await page.click('aside button:has-text("Overview")');
  await page.screenshot({ path: 'verification/ucsf_admin_light.png' });
});
