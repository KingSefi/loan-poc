import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { BRAND_CONFIG, SIMULATOR_CONFIG, SimulatorConfig } from 'core';

import { CardSelector } from '../../shared/card-selector/card-selector';
import { LinkedSliders } from '../../shared/linked-sliders/linked-sliders';
import { ToggleSelector } from '../../shared/toggle-selector/toggle-selector';

const DEFAULT_SIMULATOR_CONFIG: SimulatorConfig = {
  projectTypes: [
    { id: 'auto', label: 'Auto', icon: 'directions_car', hasSubCategory: true },
    { id: 'travaux', label: 'Travaux', icon: 'construction' },
    { id: 'projet', label: 'Projet', icon: 'lightbulb' },
    { id: 'etudiant', label: 'Étudiant', icon: 'school' },
  ],
  amountRange: { min: 1_000, max: 75_000, step: 500 },
  monthlyRange: { min: 50, max: 2_000, step: 10 },
  durationRange: { min: 6, max: 84, step: 6 },
};

@Component({
  selector: 'lib-loan-simulator',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    CardSelector,
    LinkedSliders,
    ToggleSelector,
  ],
  template: `
    <div class="simulator">
      <h1>Simulateur de prêt</h1>
      <p class="subtitle">{{ brandName() }} — Estimez votre financement en quelques clics</p>

      <mat-card>
        <mat-card-content>
          <h3>Quel est votre projet ?</h3>
          <lib-card-selector
            [options]="projectTypeCards()"
            [(selected)]="selectedProject"
            ariaLabel="Type de projet"
          />

          @if (showSubCategory()) {
            <h3>Précisez</h3>
            <lib-toggle-selector
              [options]="subCategoryOptions"
              [(selected)]="subCategory"
              ariaLabel="Sous-catégorie"
            />
          }

          <h3>Votre financement</h3>
          <lib-linked-sliders
            [(amount)]="amount"
            [(monthly)]="monthly"
            [(duration)]="duration"
            [amountRange]="config.amountRange"
            [monthlyRange]="config.monthlyRange"
            [durationRange]="config.durationRange"
          />

          <div class="simulator-actions">
            <button mat-flat-button class="simulate-button">
              <mat-icon>calculate</mat-icon>
              Simuler mon projet
            </button>
          </div>

          <p class="legal-text">
            Cette simulation est fournie à titre indicatif et ne constitue pas une offre de crédit.
            Le taux et les conditions définitives seront déterminés lors de l'étude de votre dossier.
            Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement
            avant de vous engager.
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .simulator {
      max-width: 700px;
      margin: 0 auto;
    }

    h1 {
      margin-top: 0;
    }

    .subtitle {
      opacity: 0.7;
      margin-bottom: 1.5rem;
    }

    h3 {
      margin: 1.5rem 0 0.5rem;

      &:first-child {
        margin-top: 0;
      }
    }

    .simulator-actions {
      display: flex;
      justify-content: center;
      margin: 2rem 0 1rem;
    }

    .simulate-button {
      font-size: 1rem;
      padding: 0.75rem 2rem;
    }

    .legal-text {
      font-size: 0.75rem;
      opacity: 0.5;
      line-height: 1.5;
      text-align: center;
      margin-top: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanSimulator {
  private readonly brandConfig = inject(BRAND_CONFIG, { optional: true });
  readonly config = inject(SIMULATOR_CONFIG, { optional: true }) ?? DEFAULT_SIMULATOR_CONFIG;

  readonly brandName = computed(() => this.brandConfig?.name ?? 'App');

  readonly selectedProject = signal<string | null>(null);
  readonly subCategory = signal<string | null>(null);
  readonly amount = signal(20_000);
  readonly monthly = signal(300);
  readonly duration = signal(66);

  readonly projectTypeCards = computed(() =>
    this.config.projectTypes.map((pt) => ({
      id: pt.id,
      label: pt.label,
      icon: pt.icon,
    })),
  );

  readonly showSubCategory = computed(() => {
    const sel = this.selectedProject();
    return this.config.projectTypes.some((pt) => pt.id === sel && pt.hasSubCategory);
  });

  readonly subCategoryOptions = [
    { value: 'neuve', label: 'Neuve' },
    { value: 'occasion', label: 'Occasion' },
  ];
}
