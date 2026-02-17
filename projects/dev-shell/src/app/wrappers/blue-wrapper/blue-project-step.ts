import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  CardSelector,
  QuestionBlock,
  ToggleSelector,
  type WizardStep,
} from 'white-label';

@Component({
  selector: 'app-blue-project-step',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatFormFieldModule,
    MatInputModule,
    CardSelector,
    QuestionBlock,
    ToggleSelector,
  ],
  template: `
    <div class="blue-project-step">
      <h2>Votre Projet</h2>

      <lib-question-block label="Quel est votre projet ?">
        <lib-card-selector
          [options]="projectTypeCards"
          [(selected)]="projectType"
          ariaLabel="Type de projet"
        />
      </lib-question-block>

      <lib-question-block label="Type de bien" [visible]="showPropertyType()">
        <lib-card-selector
          [options]="propertyTypeCards"
          [(selected)]="propertyType"
          ariaLabel="Type de bien"
        />
      </lib-question-block>

      <lib-question-block label="État du bien" [visible]="showSubType()">
        <lib-toggle-selector
          [options]="subTypeOptions"
          [(selected)]="subType"
          ariaLabel="État du bien"
        />
      </lib-question-block>

      <lib-question-block label="Usage du bien" [visible]="showUsage()">
        <lib-card-selector
          [options]="usageCards"
          [(selected)]="usage"
          ariaLabel="Usage du bien"
        />
      </lib-question-block>

      <lib-question-block label="Avez-vous trouvé votre bien ?" [visible]="showFoundProperty()">
        <lib-toggle-selector
          [options]="yesNoOptions"
          [(selected)]="foundProperty"
          ariaLabel="Bien trouvé"
        />
      </lib-question-block>

      <lib-question-block label="Localisation du bien" [visible]="showLocation()">
        <form [formGroup]="locationForm" class="form-grid">
          <mat-form-field class="full-width">
            <mat-label>Adresse</mat-label>
            <input matInput formControlName="address" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Code postal</mat-label>
            <input matInput formControlName="postalCode" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Ville</mat-label>
            <input matInput formControlName="city" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Pays</mat-label>
            <input matInput formControlName="country" />
          </mat-form-field>
        </form>
      </lib-question-block>

      <lib-question-block label="Votre budget" [visible]="showFinancials()">
        <div class="financial-grid">
          <mat-form-field>
            <mat-label>Valeur du bien</mat-label>
            <input matInput type="number" [value]="propertyValue()" (input)="propertyValue.set(+$any($event.target).value)" />
            <span matTextSuffix>€</span>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Montant des travaux</mat-label>
            <input matInput type="number" [value]="initialAmount()" (input)="initialAmount.set(+$any($event.target).value)" />
            <span matTextSuffix>€</span>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Apport personnel</mat-label>
            <input matInput type="number" [value]="contribution()" (input)="contribution.set(+$any($event.target).value)" />
            <span matTextSuffix>€</span>
          </mat-form-field>
        </div>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-row">
              <span>Coût global du projet</span>
              <strong>{{ totalCost() | currency:'EUR':'symbol':'1.0-0' }}</strong>
            </div>
            <div class="summary-row highlight">
              <span>Besoin de financement</span>
              <strong>{{ financingNeed() | currency:'EUR':'symbol':'1.0-0' }}</strong>
            </div>
          </mat-card-content>
        </mat-card>
      </lib-question-block>
    </div>
  `,
  styles: `
    h2 { margin-top: 0; margin-bottom: 1rem; }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 1rem;
      .full-width { grid-column: 1 / -1; }
    }
    .financial-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 1rem;
    }
    .summary-card { margin-top: 1rem; }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      &.highlight {
        border-bottom: none;
        font-size: 1.1rem;
        color: var(--mat-sys-primary, #1e40af);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlueProjectStep implements WizardStep {
  readonly projectType = signal<string | null>(null);
  readonly projectTypeCards = [
    { id: 'acheter', label: 'Acheter', icon: 'home', description: 'Acquérir un bien immobilier' },
    { id: 'financer', label: 'Financer', icon: 'account_balance', description: 'Financer des travaux' },
    { id: 'racheter', label: 'Racheter', icon: 'swap_horiz', description: 'Racheter un crédit' },
    { id: 'autre', label: 'Autre projet', icon: 'lightbulb', description: 'Autre besoin de financement' },
  ];

  readonly propertyType = signal<string | null>(null);
  readonly propertyTypeCards = [
    { id: 'maison', label: 'Maison', icon: 'house' },
    { id: 'appartement', label: 'Appartement', icon: 'apartment' },
    { id: 'terrain', label: 'Terrain', icon: 'landscape' },
    { id: 'local', label: 'Local commercial', icon: 'store' },
  ];

  readonly subType = signal<string | null>(null);
  readonly subTypeOptions = [
    { value: 'neuve', label: 'Neuve' },
    { value: 'occasion', label: 'Ancien' },
  ];

  readonly usage = signal<string | null>(null);
  readonly usageCards = [
    { id: 'principal', label: 'Résidence principale', icon: 'home' },
    { id: 'secondaire', label: 'Résidence secondaire', icon: 'holiday_village' },
    { id: 'locatif', label: 'Investissement locatif', icon: 'real_estate_agent' },
  ];

  readonly foundProperty = signal<string | null>(null);
  readonly yesNoOptions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' },
  ];

  readonly showPropertyType = computed(() => this.projectType() === 'acheter' || this.projectType() === 'financer');
  readonly showSubType = computed(() => this.showPropertyType() && this.propertyType() !== null);
  readonly showUsage = computed(() => this.showSubType() && this.subType() !== null);
  readonly showFoundProperty = computed(() => this.showUsage() && this.usage() !== null);
  readonly showLocation = computed(() => this.showFoundProperty() && this.foundProperty() === 'oui');
  readonly showFinancials = computed(() => this.showFoundProperty() && this.foundProperty() !== null);

  readonly locationForm = new FormGroup({
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    postalCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    country: new FormControl('France', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly propertyValue = signal(0);
  readonly initialAmount = signal(0);
  readonly contribution = signal(0);

  readonly totalCost = computed(() => this.propertyValue() + this.initialAmount());
  readonly financingNeed = computed(() => Math.max(0, this.totalCost() - this.contribution()));

  readonly form = new FormGroup({ location: this.locationForm });
}
