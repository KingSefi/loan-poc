import { InjectionToken, Type } from '@angular/core';

// ─── Wizard Step Config ─────────────────────────────────────
export interface WizardStepConfig {
  readonly id: string;
  readonly label: string;
  readonly component: Type<unknown>;
}

export const WIZARD_STEPS = new InjectionToken<readonly WizardStepConfig[]>('WIZARD_STEPS');

export const WIZARD_STEP_OVERRIDES = new InjectionToken<Record<string, Type<unknown>>>(
  'WIZARD_STEP_OVERRIDES',
);

// ─── Profile Step Config ────────────────────────────────────
export interface ProfileFieldConfig {
  readonly name: string;
  readonly label: string;
  readonly type: 'text' | 'email' | 'tel' | 'date' | 'select';
  readonly required?: boolean;
  readonly options?: readonly string[];
}

export interface ProfileStepConfig {
  readonly borrowerModes: readonly string[];
  readonly fields: readonly ProfileFieldConfig[];
  readonly residenceOptions: readonly string[];
}

export const PROFILE_STEP_CONFIG = new InjectionToken<ProfileStepConfig>('PROFILE_STEP_CONFIG');

// ─── Budget Step Config ─────────────────────────────────────
export interface BudgetFieldConfig {
  readonly name: string;
  readonly label: string;
  readonly suffix?: string;
}

export interface BudgetStepConfig {
  readonly revenueFields: readonly BudgetFieldConfig[];
  readonly chargeFields: readonly BudgetFieldConfig[];
}

export const BUDGET_STEP_CONFIG = new InjectionToken<BudgetStepConfig>('BUDGET_STEP_CONFIG');

// ─── Insurance Step Config ──────────────────────────────────
export interface InsuranceCoverageOption {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
}

export interface InsuranceToggleQuestion {
  readonly id: string;
  readonly label: string;
}

export interface InsuranceStepConfig {
  readonly coverageOptions: readonly InsuranceCoverageOption[];
  readonly toggleQuestions: readonly InsuranceToggleQuestion[];
  readonly infoText: string;
}

export const INSURANCE_STEP_CONFIG = new InjectionToken<InsuranceStepConfig>(
  'INSURANCE_STEP_CONFIG',
);

// ─── Simulator Config ───────────────────────────────────────
export interface SimulatorProjectType {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly hasSubCategory?: boolean;
}

export interface SliderRange {
  readonly min: number;
  readonly max: number;
  readonly step: number;
}

export interface SimulatorConfig {
  readonly projectTypes: readonly SimulatorProjectType[];
  readonly amountRange: SliderRange;
  readonly monthlyRange: SliderRange;
  readonly durationRange: SliderRange;
}

export const SIMULATOR_CONFIG = new InjectionToken<SimulatorConfig>('SIMULATOR_CONFIG');
