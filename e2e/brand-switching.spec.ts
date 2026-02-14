import { expect, test } from '@playwright/test';

test.describe('Brand Switching', () => {
  test('redirects to /green/dashboard by default', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/green\/dashboard/);
  });

  test('green brand shows sidenav layout with light theme', async ({ page }) => {
    await page.goto('/green/dashboard');
    await expect(page.locator('mat-sidenav')).toBeVisible();
    await expect(page.locator('lib-default-header')).toBeVisible();

    const html = page.locator('html');
    await expect(html).toHaveClass(/light-theme/);
    await expect(html).not.toHaveClass(/purple-brand/);
  });

  test('switching to purple brand navigates and changes theme', async ({ page }) => {
    await page.goto('/green/dashboard');

    const purpleToggle = page.locator('mat-button-toggle[value="/purple"] button');
    await purpleToggle.click();

    await expect(page).toHaveURL(/\/purple\/home/);
    await expect(page.locator('html')).toHaveClass(/dark-theme/);
    await expect(page.locator('html')).toHaveClass(/purple-brand/);
  });

  test('switching back to green brand restores state', async ({ page }) => {
    await page.goto('/green/dashboard');

    // Switch to purple first
    const purpleToggle = page.locator('mat-button-toggle[value="/purple"] button');
    await purpleToggle.click();
    await expect(page).toHaveURL(/\/purple\/home/);

    // Switch back to green
    const greenToggle = page.locator('mat-button-toggle[value="/green"] button');
    await greenToggle.click();

    await expect(page).toHaveURL(/\/green\/dashboard/);
    await expect(page.locator('mat-sidenav')).toBeVisible();
    await expect(page.locator('html')).toHaveClass(/light-theme/);
    await expect(page.locator('html')).not.toHaveClass(/purple-brand/);
  });
});
