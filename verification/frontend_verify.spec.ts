import { test, expect } from '@playwright/test';

test('verify Harmonia MUN 2026 home page', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Verify Branding
  await expect(page.locator('h1')).toContainText('Harmonia');

  // Take screenshot of Home
  await page.screenshot({ path: 'verification/screenshots/final_home.png', fullPage: true });
});

test('verify Committees section and Background Guide', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Navigate to Committees (Events)
  await page.click('button:has-text("Committees")');

  // Verify section title
  await expect(page.locator('h2:has-text("Conventional Committees")')).toBeVisible();

  // Wait for the first card to be visible
  const card = page.locator('h3:has-text("UN Security Council")');
  await card.waitFor({ state: 'visible' });
  await card.click();

  // Verify Background Guide button exists in expanded view
  await expect(page.locator('a:has-text("Download Background Guide")')).toBeVisible();

  // Take screenshot of expanded committee
  await page.screenshot({ path: 'verification/screenshots/final_committee_expanded.png' });
});

test('verify Admin access from UI', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Click Admin in nav
  await page.click('button:has-text("Admin")');

  // Verify Admin Access screen (login)
  await expect(page.locator('div:has-text("ADMIN ACCESS")')).toBeVisible();

  // Take screenshot of Admin login
  await page.screenshot({ path: 'verification/screenshots/final_admin_login.png' });
});
