import { expect, test } from '@playwright/test';

test.describe('Loan Application - Green Bank', () => {
  test('renders loan application page with 4 steps', async ({ page }) => {
    await page.goto('/green/loans/apply');

    await expect(page.locator('h1')).toContainText('Apply for a Personal Loan');
    const steps = page.locator('.mat-step-header');
    await expect(steps).toHaveCount(4);
  });

  test('personal info fields are visible on step 1', async ({ page }) => {
    await page.goto('/green/loans/apply');

    await expect(page.locator('input[formcontrolname="fullName"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="email"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="phone"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="address"]')).toBeVisible();
  });

  test('linear stepper prevents skipping to next step', async ({ page }) => {
    await page.goto('/green/loans/apply');

    await page.locator('button:visible', { hasText: 'Next' }).click();

    // Should still be on step 1 — fullName field still visible
    await expect(page.locator('input[formcontrolname="fullName"]')).toBeVisible();
  });

  test('complete happy-path flow shows success card', async ({ page }) => {
    await page.goto('/green/loans/apply');

    // Step 1: Personal Info
    await page.locator('input[formcontrolname="fullName"]').fill('John Doe');
    await page.locator('input[formcontrolname="dateOfBirth"]').fill('01/15/1990');
    await page.locator('input[formcontrolname="email"]').fill('john@example.com');
    await page.locator('input[formcontrolname="phone"]').fill('5551234567');
    await page.locator('input[formcontrolname="address"]').fill('123 Main Street, Anytown');
    await page.locator('button:visible', { hasText: 'Next' }).click();

    // Step 2: Income Details — wait for fields to appear
    await expect(page.locator('input[formcontrolname="employerName"]')).toBeVisible();
    await page.locator('input[formcontrolname="employerName"]').fill('Acme Corp');
    await page.locator('input[formcontrolname="position"]').fill('Developer');
    await page.locator('input[formcontrolname="annualSalary"]').fill('75000');
    await page.locator('input[formcontrolname="yearsAtJob"]').fill('3');
    await page.locator('button:visible', { hasText: 'Next' }).click();

    // Step 3: Loan Amount — wait for select to appear, then pick term and purpose
    await expect(page.locator('mat-select[formcontrolname="termMonths"]')).toBeVisible();
    await page.locator('mat-select[formcontrolname="termMonths"]').click();
    await page.locator('mat-option').first().click();
    await page.locator('mat-select[formcontrolname="purpose"]').click();
    await page.locator('mat-option').first().click();
    await page.locator('button:visible', { hasText: 'Next' }).click();

    // Step 4: Review & Submit — wait for checkbox to appear and check it
    await expect(page.locator('mat-checkbox')).toBeVisible();
    await page.locator('mat-checkbox label').click();
    await expect(page.locator('button', { hasText: 'Submit Application' })).toBeEnabled();
    await page.locator('button', { hasText: 'Submit Application' }).click();

    // Success card
    const success = page.locator('.success-card');
    await expect(success).toBeVisible();
    await expect(success).toContainText('John Doe');
    await expect(success).toContainText('LN-');
  });
});

test.describe('Loan Application - Purple Bank', () => {
  test('renders with PurpleBank branding', async ({ page }) => {
    await page.goto('/purple/loans/apply');

    await expect(page.locator('.subtitle')).toContainText('PurpleBank');
  });

  test('has 4 steps', async ({ page }) => {
    await page.goto('/purple/loans/apply');

    const steps = page.locator('.mat-step-header');
    await expect(steps).toHaveCount(4);
  });
});

test.describe('Loan Application - Navigation from CTA', () => {
  test('dashboard Start Application link navigates to loan page', async ({ page }) => {
    await page.goto('/green/dashboard');

    await page.locator('a', { hasText: 'Start Application' }).click();
    await expect(page).toHaveURL(/\/green\/loans\/apply/);
    await expect(page.locator('h1')).toContainText('Apply for a Personal Loan');
  });

  test('home page Start Application link navigates to loan page', async ({ page }) => {
    await page.goto('/purple/home');

    await page.locator('a', { hasText: 'Start Application' }).click();
    await expect(page).toHaveURL(/\/purple\/loans\/apply/);
    await expect(page.locator('h1')).toContainText('Apply for a Personal Loan');
  });
});
