import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WIZARD_STEPS, WIZARD_STEP_OVERRIDES } from 'core';

@Component({
  selector: 'lib-guided-wizard',
  imports: [NgComponentOutlet, MatButton, MatIcon],
  template: `
    <div class="guided-wizard">
      <div class="wizard-progress">
        @for (step of resolvedSteps(); let i = $index; track step.id) {
          <div
            class="progress-dot"
            [class.active]="i === currentIndex()"
            [class.completed]="i < currentIndex()"
            (click)="goToStep(i)"
            (keydown.enter)="goToStep(i)"
            tabindex="0"
            role="tab"
            [attr.aria-label]="step.label"
            [attr.aria-selected]="i === currentIndex()"
          >
            <div class="dot">
              @if (i < currentIndex()) {
                <mat-icon>check</mat-icon>
              } @else {
                {{ i + 1 }}
              }
            </div>
            <span class="dot-label">{{ step.label }}</span>
          </div>
        }
      </div>

      <div class="wizard-content">
        @for (step of resolvedSteps(); let i = $index; track step.id) {
          @if (i === currentIndex()) {
            <div class="step-container">
              <ng-container *ngComponentOutlet="step.component" />
            </div>
          }
        }
      </div>

      <div class="wizard-actions">
        @if (currentIndex() > 0) {
          <button mat-button (click)="previous()" class="prev-button">
            <mat-icon>arrow_back</mat-icon>
            Précédent
          </button>
        }
        <span class="spacer"></span>
        @if (currentIndex() < resolvedSteps().length - 1) {
          <button mat-flat-button (click)="next()" class="next-button">
            Continuer
            <mat-icon>arrow_forward</mat-icon>
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    .guided-wizard {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
    }

    .wizard-progress {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .progress-dot {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      min-width: 80px;
      position: relative;

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 16px;
        left: calc(50% + 20px);
        width: calc(100% - 40px);
        height: 2px;
        background: rgba(0, 0, 0, 0.12);
      }

      &.completed:not(:last-child)::after {
        background: var(--mat-sys-primary, #1976d2);
      }
    }

    .dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 500;
      border: 2px solid rgba(0, 0, 0, 0.2);
      background: transparent;
      transition: all 0.3s ease;
      z-index: 1;

      .active & {
        background: var(--mat-sys-primary, #1976d2);
        border-color: var(--mat-sys-primary, #1976d2);
        color: white;
      }

      .completed & {
        background: var(--mat-sys-primary, #1976d2);
        border-color: var(--mat-sys-primary, #1976d2);
        color: white;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    }

    .dot-label {
      font-size: 0.75rem;
      text-align: center;
      opacity: 0.6;
      transition: opacity 0.2s ease;

      .active & {
        opacity: 1;
        font-weight: 500;
      }
    }

    .wizard-content {
      min-height: 300px;
    }

    .step-container {
      animation: fadeIn 0.3s ease-out;
    }

    .wizard-actions {
      display: flex;
      align-items: center;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
    }

    .spacer {
      flex: 1;
    }

    .prev-button mat-icon,
    .next-button mat-icon {
      font-size: 18px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(16px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuidedWizard {
  private readonly steps = inject(WIZARD_STEPS);
  private readonly overrides = inject(WIZARD_STEP_OVERRIDES, { optional: true });

  readonly currentIndex = signal(0);

  readonly resolvedSteps = computed(() => {
    const overrideMap = this.overrides ?? {};
    return this.steps.map((step) => ({
      ...step,
      component: overrideMap[step.id] ?? step.component,
    }));
  });

  next(): void {
    const idx = this.currentIndex();
    if (idx < this.resolvedSteps().length - 1) {
      this.currentIndex.set(idx + 1);
    }
  }

  previous(): void {
    const idx = this.currentIndex();
    if (idx > 0) {
      this.currentIndex.set(idx - 1);
    }
  }

  goToStep(index: number): void {
    if (index <= this.currentIndex()) {
      this.currentIndex.set(index);
    }
  }
}
