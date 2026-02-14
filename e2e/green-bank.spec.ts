import { expect, test } from '@playwright/test';

test.describe('Green Bank (Dashboard)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/green/dashboard');
  });

  test('renders dashboard page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('shows 4 account cards', async ({ page }) => {
    const cards = page.locator('.accounts-grid mat-card');
    await expect(cards).toHaveCount(4);
  });

  test('shows transactions section', async ({ page }) => {
    await expect(page.locator('.transactions-card')).toBeVisible();
    const rows = page.locator('.tx-row');
    await expect(rows).toHaveCount(8);
  });

  test('shows loan stepper with 4 steps', async ({ page }) => {
    const steps = page.locator('.stepper-card .mat-step-header');
    await expect(steps).toHaveCount(4);
  });

  test('sidenav shows navigation sections', async ({ page }) => {
    await expect(page.locator('mat-sidenav')).toBeVisible();
    const subheaders = page.locator('[mat-subheader]');
    await expect(subheaders).toHaveCount(3);
  });

  test('header shows GreenBank', async ({ page }) => {
    await expect(page.locator('mat-toolbar').first()).toContainText('GreenBank');
  });

  test('theme toggle switches to dark mode', async ({ page }) => {
    const toggle = page.locator('mat-slide-toggle');
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark-theme/);
  });
});
