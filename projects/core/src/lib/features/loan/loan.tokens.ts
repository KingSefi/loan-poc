import { InjectionToken } from '@angular/core';

export interface LoanConfig {
  readonly minAmount: number;
  readonly maxAmount: number;
  readonly minTermMonths: number;
  readonly maxTermMonths: number;
  readonly purposes: readonly string[];
  readonly incomeVerification: 'self-declared' | 'payslip-upload';
  readonly requiresEmployerVerification: boolean;
}

export const LOAN_CONFIG = new InjectionToken<LoanConfig>('LOAN_CONFIG');
