import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { SliderRange } from 'core';

@Component({
  selector: 'lib-linked-sliders',
  imports: [CurrencyPipe, FormsModule, MatFormFieldModule, MatInputModule, MatSlider, MatSliderThumb],
  template: `
    <div class="linked-sliders">
      <div class="slider-group">
        <label>Montant emprunté</label>
        <div class="slider-row">
          <mat-slider
            [min]="amountRange().min"
            [max]="amountRange().max"
            [step]="amountRange().step"
            discrete
          >
            <input matSliderThumb [ngModel]="amount()" (ngModelChange)="onAmountChange($event)" />
          </mat-slider>
          <span class="slider-value">{{ amount() | currency:'EUR':'symbol':'1.0-0' }}</span>
        </div>
      </div>

      <div class="slider-group">
        <label>Mensualité</label>
        <div class="slider-row">
          <mat-slider
            [min]="monthlyRange().min"
            [max]="monthlyRange().max"
            [step]="monthlyRange().step"
            discrete
          >
            <input matSliderThumb [ngModel]="monthly()" (ngModelChange)="onMonthlyChange($event)" />
          </mat-slider>
          <span class="slider-value">{{ monthly() | currency:'EUR':'symbol':'1.0-0' }}/mois</span>
        </div>
      </div>

      <div class="slider-group">
        <label>Durée</label>
        <div class="slider-row">
          <mat-slider
            [min]="durationRange().min"
            [max]="durationRange().max"
            [step]="durationRange().step"
            discrete
          >
            <input matSliderThumb [ngModel]="duration()" (ngModelChange)="onDurationChange($event)" />
          </mat-slider>
          <span class="slider-value">{{ duration() }} mois</span>
        </div>
      </div>
    </div>
  `,
  styles: `
    .linked-sliders {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem 0;
    }

    .slider-group {
      label {
        display: block;
        font-weight: 500;
        margin-bottom: 0.25rem;
      }
    }

    .slider-row {
      display: flex;
      align-items: center;
      gap: 1rem;

      mat-slider {
        flex: 1;
      }
    }

    .slider-value {
      min-width: 120px;
      text-align: right;
      font-weight: 600;
      font-size: 1.1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedSliders {
  readonly amount = model(100_000);
  readonly monthly = model(500);
  readonly duration = model(200);

  readonly amountRange = input<SliderRange>({ min: 10_000, max: 500_000, step: 5_000 });
  readonly monthlyRange = input<SliderRange>({ min: 100, max: 5_000, step: 50 });
  readonly durationRange = input<SliderRange>({ min: 12, max: 360, step: 12 });

  private updating = false;

  onAmountChange(value: number): void {
    if (this.updating) return;
    this.updating = true;
    this.amount.set(value);
    const dur = this.duration();
    if (dur > 0) {
      this.monthly.set(this.clampMonthly(Math.round(value / dur)));
    }
    this.updating = false;
  }

  onMonthlyChange(value: number): void {
    if (this.updating) return;
    this.updating = true;
    this.monthly.set(value);
    const amt = this.amount();
    if (value > 0) {
      this.duration.set(this.clampDuration(Math.round(amt / value)));
    }
    this.updating = false;
  }

  onDurationChange(value: number): void {
    if (this.updating) return;
    this.updating = true;
    this.duration.set(value);
    const amt = this.amount();
    if (value > 0) {
      this.monthly.set(this.clampMonthly(Math.round(amt / value)));
    }
    this.updating = false;
  }

  private clampMonthly(value: number): number {
    const range = this.monthlyRange();
    return Math.max(range.min, Math.min(range.max, value));
  }

  private clampDuration(value: number): number {
    const range = this.durationRange();
    return Math.max(range.min, Math.min(range.max, value));
  }
}
