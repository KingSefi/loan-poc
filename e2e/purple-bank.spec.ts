import { expect, test } from '@playwright/test';

test.describe('Purple Bank (Home Page)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/purple/home');
  });

  test('renders home page with brand name', async ({ page }) => {
    await expect(page.locator('.hero')).toContainText('Welcome to PurpleBank');
  });

  test('shows 6 quick action cards', async ({ page }) => {
    const cards = page.locator('.actions-grid .action-card');
    await expect(cards).toHaveCount(6);
  });

  test('shows 3 promo offer cards', async ({ page }) => {
    const cards = page.locator('.promos-grid .promo-card');
    await expect(cards).toHaveCount(3);
  });

  test('topnav shows menu groups', async ({ page }) => {
    const megaNav = page.locator('.mega-nav');
    await expect(megaNav).toBeVisible();
    const count = await megaNav.locator('button, a').count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('dropdown menus expand on click', async ({ page }) => {
    const accountsBtn = page.locator('.mega-nav button', { hasText: 'Accounts' });
    await accountsBtn.click();

    const menu = page.locator('.mat-mdc-menu-panel');
    await expect(menu).toBeVisible();
    await expect(menu.locator('button', { hasText: 'Checking' })).toBeVisible();
    await expect(menu.locator('button', { hasText: 'Savings' })).toBeVisible();
  });

  test('header shows PurpleBank', async ({ page }) => {
    await expect(page.locator('mat-toolbar').first()).toContainText('PurpleBank');
  });

  test('theme toggle switches to light mode', async ({ page }) => {
    const toggle = page.locator('mat-slide-toggle');
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/light-theme/);
  });
});
