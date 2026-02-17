import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { BRAND_CONFIG } from 'core';

import { WizardStep } from '../wizard-step.interface';

@Component({
  selector: 'lib-proposition-step',
  imports: [MatCard, MatCardContent, MatIcon],
  template: `
    <div class="proposition-step">
      <mat-card class="result-card">
        <mat-card-content>
          <mat-icon class="result-icon">check_circle</mat-icon>
          <h2>Votre demande a été enregistrée</h2>
          <p>
            Merci pour votre confiance. Un conseiller {{ brandName() }} vous contactera
            dans les 48 heures pour finaliser votre dossier.
          </p>
          <div class="reference">
            <span class="ref-label">Numéro de référence</span>
            <strong class="ref-number">{{ referenceNumber() }}</strong>
          </div>
          <div class="contact-info">
            <div class="contact-item">
              <mat-icon>phone</mat-icon>
              <span>01 23 45 67 89</span>
            </div>
            <div class="contact-item">
              <mat-icon>email</mat-icon>
              <span>contact&#64;{{ brandName().toLowerCase() }}.fr</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .proposition-step {
      display: flex;
      justify-content: center;
      padding: 1rem 0;
    }

    .result-card {
      max-width: 500px;
      text-align: center;

      mat-card-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 2rem;
      }
    }

    .result-icon {
      font-size: 4rem;
      width: 64px;
      height: 64px;
      color: #2e7d32;
    }

    .reference {
      margin: 1rem 0;
      padding: 1rem;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.04);
      width: 100%;
    }

    .ref-label {
      display: block;
      font-size: 0.85rem;
      opacity: 0.7;
      margin-bottom: 0.25rem;
    }

    .ref-number {
      font-size: 1.3rem;
      letter-spacing: 0.05em;
    }

    .contact-info {
      display: flex;
      gap: 2rem;
      margin-top: 0.5rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultPropositionStep implements WizardStep {
  private readonly brandConfig = inject(BRAND_CONFIG, { optional: true });

  readonly brandName = computed(() => this.brandConfig?.name ?? 'Notre banque');
  readonly referenceNumber = signal(`MTG-${Date.now().toString(36).toUpperCase()}`);
  readonly form = new FormGroup({});
}
