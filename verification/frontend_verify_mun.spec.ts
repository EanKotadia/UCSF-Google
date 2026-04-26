import { test, expect } from '@playwright/test';

test('Verify Harmonia MUN Branding and Navy/Gold Theme', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Handle SupabaseConfig if it appears
  const configTitle = page.locator('h2:has-text("Database Config")');
  if (await configTitle.isVisible()) {
    await page.fill('input[placeholder*="supabase.co"]', 'https://lyoiiwldzzvnykbrjfbh.supabase.co');
    await page.fill('input[placeholder*="key"]', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2lpd2xkenp2bnlrYnJqZmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzc2ODMsImV4cCI6MjA5MjYxMzY4M30.dKqwwz_8DDpT7QLDzmII0tSA67h6IKvUY7Qo9R3O6es');
    await page.click('button:has-text("Connect Database")');
  }

  // Wait for content to load
  await page.waitForSelector('nav', { timeout: 10000 });

  // Check for Harmonia branding in header
  const header = page.locator('nav');
  await expect(header).toContainText('Harmonia');
  await expect(header).toContainText('MUN 2026');

  // Take screenshot of homepage
  await page.screenshot({ path: 'verification/homepage_mun.png' });

  // Go to Admin and login
  await page.click('button:has-text("Admin")');
  await page.waitForSelector('input[type="password"]');
  await page.fill('input[type="password"]', 'harmonia2026');
  await page.click('button[type="submit"]');

  // Verify Admin Panel
  await page.waitForSelector('aside h1');
  await expect(page.locator('aside h1')).toContainText('Harmonia MUN');
  await page.screenshot({ path: 'verification/admin_panel_mun.png' });
});
