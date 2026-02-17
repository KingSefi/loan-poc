import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BUDGET_STEP_CONFIG, BudgetStepConfig } from 'core';

import { DynamicList } from '../../../shared/dynamic-list/dynamic-list';
import { QuestionBlock } from '../../../shared/question-block/question-block';
import { ToggleSelector } from '../../../shared/toggle-selector/toggle-selector';
import { WizardStep } from '../wizard-step.interface';

const DEFAULT_BUDGET_CONFIG: BudgetStepConfig = {
  revenueFields: [
    { name: 'salary', label: 'Revenus professionnels nets', suffix: '€/mois' },
    { name: 'rental', label: 'Revenus locatifs', suffix: '€/mois' },
  ],
  chargeFields: [
    { name: 'rent', label: 'Loyer actuel', suffix: '€/mois' },
    { name: 'taxes', label: 'Impôts', suffix: '€/mois' },
    { name: 'otherLoans', label: 'Crédits en cours', suffix: '€/mois' },
  ],
};

@Component({
  selector: 'lib-budget-step',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatFormFieldModule,
    MatInputModule,
    DynamicList,
    QuestionBlock,
    ToggleSelector,
  ],
  template: `
    <div class="budget-step">
      <lib-question-block label="Revenus">
        <form [formGroup]="revenueForm" class="form-grid">
          @for (field of config.revenueFields; track field.name) {
            <mat-form-field>
              <mat-label>{{ field.label }}</mat-label>
              <input matInput type="number" [formControlName]="field.name" />
              @if (field.suffix) {
                <span matTextSuffix>{{ field.suffix }}</span>
              }
            </mat-form-field>
          }
        </form>
        <lib-dynamic-list [(items)]="otherRevenues" addLabel="Ajouter un revenu" />
      </lib-question-block>

      <lib-question-block label="Charges">
        <form [formGroup]="chargeForm" class="form-grid">
          @for (field of config.chargeFields; track field.name) {
            <mat-form-field>
              <mat-label>{{ field.label }}</mat-label>
              <input matInput type="number" [formControlName]="field.name" />
              @if (field.suffix) {
                <span matTextSuffix>{{ field.suffix }}</span>
              }
            </mat-form-field>
          }
        </form>
        <lib-dynamic-list [(items)]="otherCharges" addLabel="Ajouter une charge" />
      </lib-question-block>

      <lib-question-block label="Rachat de crédit immobilier en cours ?">
        <lib-toggle-selector
          [options]="yesNoOptions"
          [(selected)]="hasMortgageBuyback"
          ariaLabel="Rachat de crédit"
        />
      </lib-question-block>

      <mat-card class="totals-card">
        <mat-card-content>
          <div class="total-row">
            <span>Total revenus</span>
            <strong>{{ totalRevenue() | currency:'EUR':'symbol':'1.0-0' }} /mois</strong>
          </div>
          <div class="total-row">
            <span>Total charges</span>
            <strong>{{ totalCharges() | currency:'EUR':'symbol':'1.0-0' }} /mois</strong>
          </div>
          <div class="total-row net">
            <span>Reste à vivre</span>
            <strong>{{ netIncome() | currency:'EUR':'symbol':'1.0-0' }} /mois</strong>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 1rem;
    }

    .totals-card {
      margin-top: 1rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);

      &.net {
        border-bottom: none;
        font-size: 1.1rem;
        color: var(--mat-sys-primary, #1976d2);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultBudgetStep implements WizardStep {
  readonly config = inject(BUDGET_STEP_CONFIG, { optional: true }) ?? DEFAULT_BUDGET_CONFIG;

  protected hasMortgageBuyback: string | null = null;
  protected otherRevenues = signal<FormGroup[]>([]);
  protected otherCharges = signal<FormGroup[]>([]);

  readonly yesNoOptions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' },
  ];

  readonly revenueForm: FormGroup;
  readonly chargeForm: FormGroup;
  readonly form: FormGroup;

  constructor() {
    const revenueControls: Record<string, FormControl> = {};
    for (const field of this.config.revenueFields) {
      revenueControls[field.name] = new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] });
    }
    this.revenueForm = new FormGroup(revenueControls);

    const chargeControls: Record<string, FormControl> = {};
    for (const field of this.config.chargeFields) {
      chargeControls[field.name] = new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] });
    }
    this.chargeForm = new FormGroup(chargeControls);

    this.form = new FormGroup({
      revenues: this.revenueForm,
      charges: this.chargeForm,
    });
  }

  readonly totalRevenue = computed(() => {
    let total = 0;
    for (const field of this.config.revenueFields) {
      total += Number(this.revenueForm.get(field.name)?.value) || 0;
    }
    for (const item of this.otherRevenues()) {
      total += Number(item.get('amount')?.value) || 0;
    }
    return total;
  });

  readonly totalCharges = computed(() => {
    let total = 0;
    for (const field of this.config.chargeFields) {
      total += Number(this.chargeForm.get(field.name)?.value) || 0;
    }
    for (const item of this.otherCharges()) {
      total += Number(item.get('amount')?.value) || 0;
    }
    return total;
  });

  readonly netIncome = computed(() => this.totalRevenue() - this.totalCharges());
}
