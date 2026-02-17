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
  templateUrl: './blue-project-step.html',
  styleUrl: './blue-project-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlueProjectStep implements WizardStep {
  // ─── Project type ─────────────────────────────────────────
  readonly projectType = signal<string | null>(null);
  readonly projectTypeCards = [
    { id: 'acheter', label: 'Acheter', icon: 'home', description: 'Acquérir un bien immobilier' },
    { id: 'financer', label: 'Financer', icon: 'account_balance', description: 'Financer des travaux' },
    { id: 'racheter', label: 'Racheter', icon: 'swap_horiz', description: 'Racheter un crédit' },
    { id: 'autre', label: 'Autre projet', icon: 'lightbulb', description: 'Autre besoin de financement' },
  ];

  // ─── Property type ────────────────────────────────────────
  readonly propertyType = signal<string | null>(null);
  readonly propertyTypeCards = [
    { id: 'maison', label: 'Maison', icon: 'house' },
    { id: 'appartement', label: 'Appartement', icon: 'apartment' },
    { id: 'terrain', label: 'Terrain', icon: 'landscape' },
    { id: 'local', label: 'Local commercial', icon: 'store' },
  ];

  // ─── Sub-type ─────────────────────────────────────────────
  readonly subType = signal<string | null>(null);
  readonly subTypeOptions = [
    { value: 'neuve', label: 'Neuve' },
    { value: 'occasion', label: 'Ancien' },
  ];

  // ─── Usage ────────────────────────────────────────────────
  readonly usage = signal<string | null>(null);
  readonly usageCards = [
    { id: 'principal', label: 'Résidence principale', icon: 'home' },
    { id: 'secondaire', label: 'Résidence secondaire', icon: 'holiday_village' },
    { id: 'locatif', label: 'Investissement locatif', icon: 'real_estate_agent' },
  ];

  // ─── Found property ───────────────────────────────────────
  readonly foundProperty = signal<string | null>(null);
  readonly yesNoOptions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' },
  ];

  // ─── Cascading visibility ─────────────────────────────────
  readonly showPropertyType = computed(() => this.projectType() === 'acheter' || this.projectType() === 'financer');
  readonly showSubType = computed(() => this.showPropertyType() && this.propertyType() !== null);
  readonly showUsage = computed(() => this.showSubType() && this.subType() !== null);
  readonly showFoundProperty = computed(() => this.showUsage() && this.usage() !== null);
  readonly showLocation = computed(() => this.showFoundProperty() && this.foundProperty() === 'oui');
  readonly showFinancials = computed(() => this.showFoundProperty() && this.foundProperty() !== null);

  // ─── Location form ────────────────────────────────────────
  readonly locationForm = new FormGroup({
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    postalCode: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{5}$/)] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    country: new FormControl('France', { nonNullable: true, validators: [Validators.required] }),
  });

  // ─── Financial fields ─────────────────────────────────────
  readonly propertyValue = signal(0);
  readonly initialAmount = signal(0);
  readonly capitalToRepay = signal(0);
  readonly contribution = signal(0);

  readonly totalCost = computed(() => {
    const value = this.propertyValue();
    const initial = this.initialAmount();
    return value + initial;
  });

  readonly financingNeed = computed(() => {
    const cost = this.totalCost();
    const contrib = this.contribution();
    return Math.max(0, cost - contrib);
  });

  // ─── WizardStep interface ─────────────────────────────────
  readonly form = new FormGroup({
    location: this.locationForm,
  });
}
