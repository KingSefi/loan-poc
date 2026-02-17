import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { INSURANCE_STEP_CONFIG, InsuranceStepConfig } from 'core';

import { QuestionBlock } from '../../../shared/question-block/question-block';
import { ToggleSelector } from '../../../shared/toggle-selector/toggle-selector';
import { WizardStep } from '../wizard-step.interface';

const DEFAULT_INSURANCE_CONFIG: InsuranceStepConfig = {
  coverageOptions: [
    { id: 'death', label: 'Décès', description: 'Couverture en cas de décès' },
    { id: 'disability', label: 'Invalidité', description: 'Couverture en cas d\'invalidité permanente' },
    { id: 'workStop', label: 'Arrêt de travail', description: 'Couverture en cas d\'incapacité temporaire' },
  ],
  toggleQuestions: [
    { id: 'jobLoss', label: 'Souhaitez-vous une couverture perte d\'emploi ?' },
    { id: 'riskyActivity', label: 'Pratiquez-vous un sport à risque ?' },
    { id: 'travel', label: 'Voyagez-vous fréquemment à l\'étranger ?' },
  ],
  infoText: 'L\'assurance emprunteur protège vous et votre famille en cas d\'imprévu. Elle est généralement requise par les établissements prêteurs.',
};

@Component({
  selector: 'lib-insurance-step',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatIcon,
    QuestionBlock,
    ToggleSelector,
  ],
  template: `
    <div class="insurance-step">
      <mat-card class="info-card">
        <mat-card-content>
          <div class="info-content">
            <mat-icon>info</mat-icon>
            <p>{{ config.infoText }}</p>
          </div>
        </mat-card-content>
      </mat-card>

      <lib-question-block label="Garanties incluses">
        <div class="coverage-list">
          @for (coverage of config.coverageOptions; track coverage.id) {
            <div class="coverage-item">
              <mat-icon>verified</mat-icon>
              <div>
                <strong>{{ coverage.label }}</strong>
                @if (coverage.description) {
                  <p>{{ coverage.description }}</p>
                }
              </div>
            </div>
          }
        </div>
      </lib-question-block>

      @for (question of config.toggleQuestions; track question.id) {
        <lib-question-block [label]="question.label">
          <lib-toggle-selector
            [options]="yesNoOptions"
            [selected]="getAnswer(question.id)"
            (selectedChange)="setAnswer(question.id, $event)"
            [ariaLabel]="question.label"
          />
        </lib-question-block>
      }
    </div>
  `,
  styles: `
    .insurance-step {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-card {
      background: color-mix(in srgb, var(--mat-sys-primary, #1976d2) 8%, transparent);
      margin-bottom: 1rem;
    }

    .info-content {
      display: flex;
      gap: 1rem;
      align-items: flex-start;

      mat-icon {
        color: var(--mat-sys-primary, #1976d2);
        flex-shrink: 0;
      }

      p {
        margin: 0;
        line-height: 1.5;
      }
    }

    .coverage-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .coverage-item {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;

      mat-icon {
        color: #2e7d32;
        flex-shrink: 0;
      }

      p {
        margin: 0.25rem 0 0;
        font-size: 0.85rem;
        opacity: 0.7;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultInsuranceStep implements WizardStep {
  readonly config = inject(INSURANCE_STEP_CONFIG, { optional: true }) ?? DEFAULT_INSURANCE_CONFIG;

  readonly yesNoOptions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' },
  ];

  readonly form = new FormGroup({});
  private readonly answers = new Map<string, string | null>();

  getAnswer(id: string): string | null {
    return this.answers.get(id) ?? null;
  }

  setAnswer(id: string, value: string | null): void {
    this.answers.set(id, value);
  }
}
