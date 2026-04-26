# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: record_admin.spec.ts >> record admin panel walkthrough
- Location: record_admin.spec.ts:8:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('UCSF')
Expected: visible
Error: strict mode violation: getByText('UCSF') resolved to 3 elements:
    1) <p class="text-[10px] font-bold uppercase tracking-[0.2em] leading-none mb-1">UCSF 2026</p> aka getByRole('button', { name: 'School Logo UCSF 2026 Union' })
    2) <h1 class="text-xl font-display uppercase tracking-tight text-white leading-none">UCSF</h1> aka getByRole('heading', { name: 'UCSF' })
    3) <div class="font-display text-4xl tracking-[4px] uppercase">…</div> aka getByRole('contentinfo').getByText('UCSF')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('UCSF')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]: Day 3 points updated for sports results.
    - navigation [ref=e6]:
      - button "School Logo UCSF 2026 Union of Fest" [ref=e7]:
        - img "School Logo" [ref=e8]
        - generic [ref=e9]:
          - paragraph [ref=e10]: UCSF 2026
          - paragraph [ref=e11]: Union of Fest
      - list [ref=e12]:
        - listitem [ref=e13]:
          - button "Home" [ref=e14]
        - listitem [ref=e15]:
          - button "Events" [ref=e16]
        - listitem [ref=e17]:
          - button "Rankings" [ref=e18]
        - listitem [ref=e19]:
          - button "Notices" [ref=e20]
        - listitem [ref=e21]:
          - button "Gallery" [ref=e22]
        - listitem [ref=e23]:
          - button "Admin" [ref=e24]
  - main [ref=e25]:
    - generic [ref=e28]:
      - complementary [ref=e29]:
        - generic [ref=e31]:
          - img [ref=e33]
          - generic [ref=e35]:
            - heading "UCSF" [level=1] [ref=e36]
            - paragraph [ref=e37]: Fest Admin
        - navigation [ref=e38]:
          - button "Score Entry" [ref=e39]:
            - img [ref=e40]
            - text: Score Entry
          - button "Match MGMT" [ref=e46]:
            - img [ref=e47]
            - text: Match MGMT
          - button "Schedule" [ref=e49]:
            - img [ref=e50]
            - text: Schedule
          - button "Events" [ref=e52]:
            - img [ref=e53]
            - text: Events
          - button "Notices" [ref=e57]:
            - img [ref=e58]
            - text: Notices
          - button "Gallery" [ref=e61]:
            - img [ref=e62]
            - text: Gallery
          - button "Standings" [ref=e66]:
            - img [ref=e67]
            - text: Standings
          - button "Settings" [ref=e73]:
            - img [ref=e74]
            - text: Settings
          - button "Approvals" [ref=e77]:
            - img [ref=e78]
            - text: Approvals
        - generic [ref=e81]:
          - button "Logout" [ref=e82]:
            - img [ref=e83]
            - text: Logout
          - button "Back to Site" [active] [ref=e86]:
            - img [ref=e87]
            - text: Back to Site
      - generic [ref=e91]:
        - generic [ref=e92]:
          - heading "settings" [level=2] [ref=e94]
          - button [ref=e96]:
            - img [ref=e97]
        - main [ref=e102]:
          - generic [ref=e104]:
            - heading "Site Settings" [level=3] [ref=e105]
            - generic [ref=e107]:
              - generic [ref=e108]:
                - text: festival name
                - textbox [ref=e109]: UCSF 2026
              - generic [ref=e110]:
                - text: festival subtitle
                - textbox [ref=e111]
              - generic [ref=e112]:
                - text: festival dates
                - textbox [ref=e113]
              - generic [ref=e114]:
                - text: school logo url
                - textbox [ref=e115]: https://lyoiiwldzzvnykbrjfbh.supabase.co/storage/v1/object/public/UCSF-MEDIA/category-c949a855-e2e5-43fa-8db9-e0e26e84412f-1775580187163.png
              - generic [ref=e116]:
                - text: announcement text
                - textbox [ref=e117]: Day 3 points updated for sports results.
  - contentinfo [ref=e118]:
    - generic [ref=e119]:
      - generic [ref=e120]:
        - img "School Logo" [ref=e121]
        - generic [ref=e122]: UCSF 2026
        - paragraph [ref=e123]: Union of Culture & Sports Fest
      - generic [ref=e125]:
        - generic [ref=e126]: © 2026 Shalom Hills International School
        - generic [ref=e127]:
          - generic [ref=e128]: Ean Kotadia
          - generic [ref=e129]: Hardik Batra
          - generic [ref=e130]: Tanush Kansal
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.use({
  4  |   video: 'on',
  5  |   viewport: { width: 1280, height: 720 },
  6  | });
  7  |
  8  | test('record admin panel walkthrough', async ({ page }) => {
  9  |   await page.goto('http://localhost:3000/');
  10 |
  11 |   // Navigate to Admin
  12 |   await page.getByRole('button', { name: 'Admin' }).first().click();
  13 |
  14 |   // Login
  15 |   await page.getByPlaceholder('••••••••').fill('ucsf2026');
  16 |   await page.getByRole('button', { name: /Authenticate/i }).click();
  17 |
  18 |   // Walkthrough tabs
  19 |   const sidebar = page.getByRole('complementary');
  20 |   const tabs = ['Score Entry', 'Match MGMT', 'Schedule', 'Events', 'Notices', 'Gallery', 'Standings', 'Settings'];
  21 |
  22 |   for (const tab of tabs) {
  23 |     await sidebar.getByRole('button', { name: tab }).click();
  24 |     await page.waitForTimeout(1000); // Wait for transition
  25 |   }
  26 |
  27 |   // Go back to home
  28 |   await sidebar.getByRole('button', { name: 'Back to Site' }).click();
> 29 |   await expect(page.getByText('UCSF')).toBeVisible();
     |                                        ^ Error: expect(locator).toBeVisible() failed
  30 |   await page.waitForTimeout(2000);
  31 | });
  32 |
```