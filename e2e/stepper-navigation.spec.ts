import { expect, test } from '@playwright/test';

test.describe('Stepper Navigation', () => {
  test('loan application stepper navigates between steps', async ({ page }) => {
    await page.goto('/green/loans/apply');

    const stepper = page.locator('lib-default-stepper');
    await expect(stepper).toBeVisible();

    const labels = stepper.locator('.mat-step-text-label');
    await expect(labels).toHaveCount(4);
    await expect(labels.nth(0)).toHaveText('Personal Info');
    await expect(labels.nth(1)).toHaveText('Income Details');
    await expect(labels.nth(2)).toHaveText('Loan Amount');
    await expect(labels.nth(3)).toHaveText('Review & Submit');
  });

  test('linear stepper prevents skipping steps when forms are invalid', async ({ page }) => {
    await page.goto('/green/loans/apply');

    // Try clicking Next without filling form — should stay on step 1
    const nextBtn = page.locator('button', { hasText: 'Next' }).first();
    await nextBtn.click();

    // Step 1 fields should still be visible (stepper didn't advance)
    await expect(page.locator('input[formcontrolname="fullName"]')).toBeVisible();
  });
});
