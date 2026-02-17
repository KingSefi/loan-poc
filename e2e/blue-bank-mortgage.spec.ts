import { expect, test } from '@playwright/test';

test.describe('Blue Bank — Mortgage Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blue/mortgage/apply');
  });

  test('renders wizard with 5 step progress dots', async ({ page }) => {
    const dots = page.locator('.progress-dot');
    await expect(dots).toHaveCount(5);
  });

  test('step 1 shows project type cards', async ({ page }) => {
    await expect(page.locator('text=Votre Projet')).toBeVisible();
    await expect(page.locator('text=Acheter')).toBeVisible();
    await expect(page.locator('text=Financer')).toBeVisible();
    await expect(page.locator('text=Racheter')).toBeVisible();
    await expect(page.locator('text=Autre projet')).toBeVisible();
  });

  test('step 1 cascading: selecting Acheter shows property types', async ({ page }) => {
    await page.locator('text=Acheter').click();
    await expect(page.locator('text=Maison')).toBeVisible();
    await expect(page.locator('text=Appartement')).toBeVisible();
  });

  test('step 1 cascading: property type → sub-type → usage → found', async ({ page }) => {
    await page.locator('text=Acheter').click();
    await page.locator('text=Appartement').click();
    await expect(page.locator('text=Neuve')).toBeVisible();

    await page.locator('text=Neuve').click();
    await expect(page.locator('text=Résidence principale')).toBeVisible();

    await page.locator('text=Résidence principale').click();
    await expect(page.locator('text=Oui')).toBeVisible();
  });

  test('navigates to step 2 via Continuer button', async ({ page }) => {
    const continueButton = page.locator('button', { hasText: 'Continuer' });
    await continueButton.click();
    await expect(page.locator('text=Nombre d\'emprunteurs')).toBeVisible();
  });

  test('navigates back via Précédent button', async ({ page }) => {
    const continueButton = page.locator('button', { hasText: 'Continuer' });
    await continueButton.click();
    const prevButton = page.locator('button', { hasText: 'Précédent' });
    await prevButton.click();
    await expect(page.locator('text=Votre Projet')).toBeVisible();
  });

  test('full 5-step navigation', async ({ page }) => {
    const continueButton = page.locator('button', { hasText: 'Continuer' });

    // Step 1 → 2
    await continueButton.click();
    await expect(page.locator('text=Nombre d\'emprunteurs')).toBeVisible();

    // Step 2 → 3
    await continueButton.click();
    await expect(page.locator('text=Revenus')).toBeVisible();

    // Step 3 → 4
    await continueButton.click();
    await expect(page.locator('text=Garanties incluses')).toBeVisible();

    // Step 4 → 5
    await continueButton.click();
    await expect(page.locator('text=Votre demande a été enregistrée')).toBeVisible();
  });

  test('step 5 shows reference number', async ({ page }) => {
    const continueButton = page.locator('button', { hasText: 'Continuer' });
    for (let i = 0; i < 4; i++) {
      await continueButton.click();
    }
    await expect(page.locator('.ref-number')).toBeVisible();
    await expect(page.locator('.ref-number')).toContainText('MTG-');
  });
});

test.describe('Blue Bank — Loan Simulator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blue/simulator');
  });

  test('renders simulator page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Simulateur de prêt');
  });

  test('shows project type cards', async ({ page }) => {
    await expect(page.locator('text=Auto')).toBeVisible();
    await expect(page.locator('text=Travaux')).toBeVisible();
    await expect(page.locator('text=Projet')).toBeVisible();
    await expect(page.locator('text=Étudiant')).toBeVisible();
  });

  test('selecting Auto shows sub-category toggle', async ({ page }) => {
    await page.locator('text=Auto').click();
    await expect(page.locator('text=Neuve')).toBeVisible();
    await expect(page.locator('text=Occasion')).toBeVisible();
  });

  test('sliders are present', async ({ page }) => {
    await expect(page.locator('text=Montant emprunté')).toBeVisible();
    await expect(page.locator('text=Mensualité')).toBeVisible();
    await expect(page.locator('text=Durée')).toBeVisible();
  });

  test('simulate button is visible', async ({ page }) => {
    await expect(page.locator('text=Simuler mon projet')).toBeVisible();
  });
});

test.describe('Blue Bank — Navigation', () => {
  test('header shows BlueBank', async ({ page }) => {
    await page.goto('/blue/home');
    await expect(page.locator('mat-toolbar').first()).toContainText('BlueBank');
  });

  test('topnav shows navigation items', async ({ page }) => {
    await page.goto('/blue/home');
    await expect(page.locator('text=Accueil')).toBeVisible();
    await expect(page.locator('text=Simulateur')).toBeVisible();
    await expect(page.locator('text=Demande de prêt')).toBeVisible();
  });
});
