import type { Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BRAND_CONFIG, LOAN_CONFIG, LoanConfig } from 'core';

import { LoanApplication } from './loan-application';

const GREEN_LOAN_CONFIG: LoanConfig = {
  minAmount: 1000,
  maxAmount: 50_000,
  minTermMonths: 12,
  maxTermMonths: 60,
  purposes: [
    'Home Improvement',
    'Debt Consolidation',
    'Education',
    'Medical Expenses',
    'Vehicle Purchase',
    'Other',
  ],
  incomeVerification: 'self-declared',
  requiresEmployerVerification: false,
};

const PURPLE_LOAN_CONFIG: LoanConfig = {
  minAmount: 5000,
  maxAmount: 100_000,
  minTermMonths: 6,
  maxTermMonths: 84,
  purposes: [
    'Home Renovation',
    'Business Investment',
    'Debt Consolidation',
    'Travel',
    'Wedding',
    'Other',
  ],
  incomeVerification: 'payslip-upload',
  requiresEmployerVerification: true,
};

describe('LoanApplication', () => {
  async function setup(options?: {
    loanConfig?: LoanConfig;
    brandName?: string;
  }): Promise<ComponentFixture<LoanApplication>> {
    const providers: Provider[] = [];
    if (options?.loanConfig) {
      providers.push({ provide: LOAN_CONFIG, useValue: options.loanConfig });
    }
    if (options?.brandName) {
      providers.push({
        provide: BRAND_CONFIG,
        useValue: { name: options.brandName, primaryColor: '#000', theme: 'light' },
      });
    }

    await TestBed.configureTestingModule({
      imports: [LoanApplication],
      providers,
    }).compileComponents();

    const fixture = TestBed.createComponent(LoanApplication);
    await fixture.whenStable();
    return fixture;
  }

  it('should create without LOAN_CONFIG', async () => {
    const fixture = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should create with LOAN_CONFIG', async () => {
    const fixture = await setup({ loanConfig: GREEN_LOAN_CONFIG });
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders 4 stepper steps', async () => {
    const fixture = await setup({ loanConfig: GREEN_LOAN_CONFIG });
    const stepHeaders = fixture.nativeElement.querySelectorAll('.mat-step-header');
    expect(stepHeaders.length).toBe(4);
  });

  it('shows brand name in subtitle', async () => {
    const fixture = await setup({ brandName: 'GreenBank', loanConfig: GREEN_LOAN_CONFIG });
    const subtitle = fixture.nativeElement.querySelector('.subtitle');
    expect(subtitle.textContent).toContain('GreenBank');
  });

  it('personalInfoForm is invalid when empty', async () => {
    const fixture = await setup({ loanConfig: GREEN_LOAN_CONFIG });
    expect(fixture.componentInstance.personalInfoForm.valid).toBe(false);
  });

  it('validates email format', async () => {
    const fixture = await setup({ loanConfig: GREEN_LOAN_CONFIG });
    const emailCtrl = fixture.componentInstance.personalInfoForm.controls.email;

    emailCtrl.setValue('invalid');
    expect(emailCtrl.hasError('email')).toBe(true);

    emailCtrl.setValue('test@example.com');
    expect(emailCtrl.hasError('email')).toBe(false);
  });

  it('loanForm respects LOAN_CONFIG min/max', async () => {
    const fixture = await setup({ loanConfig: PURPLE_LOAN_CONFIG });
    const amountCtrl = fixture.componentInstance.loanForm.controls.amount;

    amountCtrl.setValue(1000);
    expect(amountCtrl.hasError('min')).toBe(true);

    amountCtrl.setValue(5000);
    expect(amountCtrl.hasError('min')).toBe(false);
  });

  it('reviewForm requires terms acceptance', async () => {
    const fixture = await setup({ loanConfig: GREEN_LOAN_CONFIG });
    const termsCtrl = fixture.componentInstance.reviewForm.controls.acceptTerms;

    expect(termsCtrl.valid).toBe(false);

    termsCtrl.setValue(true);
    expect(termsCtrl.valid).toBe(true);
  });

  it('submit shows success card with applicant name', async () => {
    const fixture = await setup({ loanConfig: GREEN_LOAN_CONFIG });
    const comp = fixture.componentInstance;

    comp.personalInfoForm.patchValue({
      fullName: 'Jane Doe',
      dateOfBirth: new Date(1990, 0, 1),
      email: 'jane@test.com',
      phone: '1234567890',
      address: '123 Main Street, City',
    });
    comp.incomeForm.patchValue({
      employerName: 'Acme',
      position: 'Dev',
      annualSalary: 80000,
      yearsAtJob: 3,
    });
    comp.loanForm.patchValue({
      amount: 10000,
      termMonths: 24,
      purpose: 'Education',
    });
    comp.reviewForm.patchValue({ acceptTerms: true });

    comp.submit();
    fixture.detectChanges();
    await fixture.whenStable();

    const successCard = fixture.nativeElement.querySelector('.success-card');
    expect(successCard).toBeTruthy();
    expect(successCard.textContent).toContain('Jane Doe');
    expect(successCard.textContent).toContain('LN-');
  });

  it('startOver resets forms and hides success', async () => {
    const fixture = await setup({ loanConfig: GREEN_LOAN_CONFIG });
    const comp = fixture.componentInstance;

    comp.personalInfoForm.patchValue({
      fullName: 'Jane Doe',
      dateOfBirth: new Date(),
      email: 'j@t.com',
      phone: '1234567890',
      address: '123 Main St City',
    });
    comp.incomeForm.patchValue({
      employerName: 'A',
      position: 'B',
      annualSalary: 50000,
      yearsAtJob: 1,
    });
    comp.loanForm.patchValue({ amount: 5000, termMonths: 12, purpose: 'Other' });
    comp.reviewForm.patchValue({ acceptTerms: true });
    comp.submit();

    comp.startOver();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(comp.submitted()).toBe(false);
    expect(comp.personalInfoForm.controls.fullName.value).toBe('');
  });

  it('purposes from config are available', async () => {
    const fixture = await setup({ loanConfig: GREEN_LOAN_CONFIG });
    expect(fixture.componentInstance.config.purposes).toEqual(GREEN_LOAN_CONFIG.purposes);
  });
});
