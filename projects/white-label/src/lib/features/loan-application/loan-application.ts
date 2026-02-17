import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { BRAND_CONFIG, LOAN_CONFIG, LoanConfig } from 'core';

import { DefaultStepper } from '../stepper/default-stepper';
import { StepDefinition } from '../stepper/step-definition';

const DEFAULT_LOAN_CONFIG: LoanConfig = {
  minAmount: 1000,
  maxAmount: 50_000,
  minTermMonths: 12,
  maxTermMonths: 60,
  purposes: ['Home Improvement', 'Debt Consolidation', 'Education', 'Other'],
  incomeVerification: 'self-declared',
  requiresEmployerVerification: false,
};

@Component({
  selector: 'lib-loan-application',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCheckbox,
    MatDatepickerModule,
    MatDivider,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatNativeDateModule,
    MatOption,
    MatSelect,
    MatSlider,
    MatSliderThumb,
    DefaultStepper,
  ],
  templateUrl: './loan-application.html',
  styleUrl: './loan-application.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanApplication {
  private readonly brandConfig = inject(BRAND_CONFIG, { optional: true });
  readonly config = inject(LOAN_CONFIG, { optional: true }) ?? DEFAULT_LOAN_CONFIG;

  readonly brandName = computed(() => this.brandConfig?.name ?? 'App');
  readonly submitted = signal(false);
  readonly referenceNumber = signal('');

  readonly personalInfoForm = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dateOfBirth: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,15}$/)],
    }),
    address: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  readonly incomeForm = new FormGroup({
    employerName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    position: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    annualSalary: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    yearsAtJob: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  readonly loanForm = new FormGroup({
    amount: new FormControl(this.config.minAmount, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(this.config.minAmount),
        Validators.max(this.config.maxAmount),
      ],
    }),
    termMonths: new FormControl<number | null>(null, { validators: [Validators.required] }),
    purpose: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly reviewForm = new FormGroup({
    acceptTerms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  readonly loanSteps: readonly StepDefinition[] = [
    { label: 'Personal Info', stepControl: this.personalInfoForm },
    { label: 'Income Details', stepControl: this.incomeForm },
    { label: 'Loan Amount', stepControl: this.loanForm },
    { label: 'Review & Submit', stepControl: this.reviewForm },
  ];

  readonly termOptions: number[];

  constructor() {
    const terms: number[] = [];
    for (let m = this.config.minTermMonths; m <= this.config.maxTermMonths; m += 6) {
      terms.push(m);
    }
    if (terms[terms.length - 1] !== this.config.maxTermMonths) {
      terms.push(this.config.maxTermMonths);
    }
    this.termOptions = terms;
  }

  submit(): void {
    if (this.reviewForm.invalid) return;
    this.referenceNumber.set(`LN-${Date.now().toString(36).toUpperCase()}`);
    this.submitted.set(true);
  }

  startOver(): void {
    this.personalInfoForm.reset();
    this.incomeForm.reset();
    this.loanForm.reset({ amount: this.config.minAmount });
    this.reviewForm.reset();
    this.submitted.set(false);
  }
}
