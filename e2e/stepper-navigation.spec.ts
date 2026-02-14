import { expect, test } from '@playwright/test';

test.describe('Stepper Navigation', () => {
  test('loan stepper navigates between steps on green dashboard', async ({ page }) => {
    await page.goto('/green/dashboard');

    const stepper = page.locator('.stepper-card');
    await expect(stepper).toBeVisible();

    // Click Next to go to step 2
    const nextBtn = stepper.locator('button', { hasText: 'Next' }).first();
    await nextBtn.click();

    // Step 2 content should be visible
    await expect(stepper.locator('text=Employer name')).toBeVisible();

    // Click Back to return to step 1
    const backBtn = stepper.locator('button', { hasText: 'Back' }).first();
    await backBtn.click();

    // Step 1 content should be visible again
    await expect(stepper.locator('text=Full name')).toBeVisible();
  });

  test('step labels match expected values on green dashboard', async ({ page }) => {
    await page.goto('/green/dashboard');

    const labels = page.locator('.stepper-card .mat-step-text-label');
    await expect(labels).toHaveCount(4);
    await expect(labels.nth(0)).toHaveText('Personal Info');
    await expect(labels.nth(1)).toHaveText('Income Details');
    await expect(labels.nth(2)).toHaveText('Loan Amount');
    await expect(labels.nth(3)).toHaveText('Review & Submit');
  });
});
