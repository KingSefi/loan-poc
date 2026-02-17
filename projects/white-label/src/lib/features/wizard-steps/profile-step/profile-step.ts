import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PROFILE_STEP_CONFIG, ProfileStepConfig } from 'core';

import { CardSelector } from '../../../shared/card-selector/card-selector';
import { ToggleSelector } from '../../../shared/toggle-selector/toggle-selector';
import { QuestionBlock } from '../../../shared/question-block/question-block';
import { WizardStep } from '../wizard-step.interface';

const DEFAULT_PROFILE_CONFIG: ProfileStepConfig = {
  borrowerModes: ['Seul', 'À deux'],
  fields: [
    { name: 'civility', label: 'Civilité', type: 'select', required: true, options: ['M.', 'Mme'] },
    { name: 'firstName', label: 'Prénom', type: 'text', required: true },
    { name: 'lastName', label: 'Nom', type: 'text', required: true },
    { name: 'birthDate', label: 'Date de naissance', type: 'date', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Téléphone', type: 'tel', required: true },
  ],
  residenceOptions: ['Propriétaire', 'Locataire', 'Hébergé'],
};

@Component({
  selector: 'lib-profile-step',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CardSelector,
    ToggleSelector,
    QuestionBlock,
  ],
  template: `
    <div class="profile-step">
      <lib-question-block label="Nombre d'emprunteurs">
        <lib-card-selector
          [options]="borrowerCards"
          [(selected)]="borrowerMode"
          ariaLabel="Nombre d'emprunteurs"
        />
      </lib-question-block>

      <lib-question-block label="Civilité">
        <lib-toggle-selector
          [options]="civilityOptions"
          [(selected)]="civility"
          ariaLabel="Civilité"
        />
      </lib-question-block>

      <form [formGroup]="form" class="form-grid">
        <mat-form-field>
          <mat-label>Prénom</mat-label>
          <input matInput formControlName="firstName" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Nom</mat-label>
          <input matInput formControlName="lastName" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Date de naissance</mat-label>
          <input matInput type="date" formControlName="birthDate" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Téléphone</mat-label>
          <input matInput formControlName="phone" />
        </mat-form-field>
      </form>

      <lib-question-block label="Situation familiale">
        <lib-toggle-selector
          [options]="familyOptions"
          [(selected)]="familySituation"
          ariaLabel="Situation familiale"
        />
      </lib-question-block>

      <lib-question-block label="Résidence actuelle">
        <lib-card-selector
          [options]="residenceCards"
          [(selected)]="residence"
          (selectedChange)="showAddress.set($event !== null)"
          ariaLabel="Résidence actuelle"
        />
      </lib-question-block>

      <lib-question-block label="Adresse" [visible]="showAddress()">
        <form [formGroup]="addressForm" class="form-grid">
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
        </form>
      </lib-question-block>
    </div>
  `,
  styles: `
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 1rem;

      .full-width {
        grid-column: 1 / -1;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultProfileStep implements WizardStep {
  private readonly config = inject(PROFILE_STEP_CONFIG, { optional: true }) ?? DEFAULT_PROFILE_CONFIG;

  protected borrowerMode = '';
  protected civility = '';
  protected familySituation: string | null = null;
  protected residence: string | null = null;
  protected readonly showAddress = signal(false);

  readonly borrowerCards = this.config.borrowerModes.map((m) => ({
    id: m,
    label: m,
    icon: m === 'Seul' ? 'person' : 'people',
  }));

  readonly civilityOptions = [
    { value: 'M.', label: 'M.' },
    { value: 'Mme', label: 'Mme' },
  ];

  readonly familyOptions = [
    { value: 'celibataire', label: 'Célibataire' },
    { value: 'marie', label: 'Marié(e)' },
    { value: 'pacse', label: 'Pacsé(e)' },
    { value: 'divorce', label: 'Divorcé(e)' },
  ];

  readonly residenceCards = this.config.residenceOptions.map((r) => ({
    id: r,
    label: r,
    icon: r === 'Propriétaire' ? 'home' : r === 'Locataire' ? 'apartment' : 'family_restroom',
  }));

  readonly form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    birthDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly addressForm = new FormGroup({
    address: new FormControl('', { nonNullable: true }),
    postalCode: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
  });
}
