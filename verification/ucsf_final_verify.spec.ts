import { test, expect } from '@playwright/test';

test('Verify UCSF Final Light Theme and Admin Panel', async ({ page }) => {
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

  // 1. Verify Light Theme Background
  const bgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
  console.log('Main BG Color:', bgColor);
  expect(bgColor).toBe('rgb(255, 255, 255)');

  // 2. Verify UCSF Branding (No Harmonia)
  await expect(page.locator('nav')).toContainText('UCSF');
  await expect(page.locator('body')).not.toContainText('Harmonia');

  // 3. Verify Hero Section (Centered, No dark boxes)
  await expect(page.locator('h1')).toContainText('UNION OF');
  await expect(page.locator('h1')).toContainText('CULTURE & SPORTS');

  // 4. Verify Admin Panel
  await page.click('button:has-text("Admin")');
  await page.waitForSelector('input[type="password"]', { timeout: 15000 });
  await page.fill('input[type="password"]', 'ucsf2026');
  await page.click('button:has-text("Access Portal")');

  await page.waitForSelector('aside', { timeout: 15000 });
  await expect(page.locator('aside h1')).toContainText('UCSF');
  await expect(page.locator('aside')).toBeVisible();

  // Verify Sidebar items
  await expect(page.locator('aside')).toContainText('Dashboard');
  await expect(page.locator('aside')).toContainText('Events');
  await expect(page.locator('aside')).toContainText('Scores');

  // Take screenshots for verification
  await page.screenshot({ path: 'verification/ucsf_final_home.png' });
  await page.click('aside button:has-text("Events")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification/ucsf_final_admin_events.png' });
});
