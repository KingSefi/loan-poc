import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  model,
  TemplateRef,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';

import { StepDefinition } from './step-definition';

@Component({
  selector: 'lib-default-stepper',
  imports: [
    MatStepper,
    MatStep,
    MatStepLabel,
    MatStepperNext,
    MatStepperPrevious,
    MatButton,
    NgTemplateOutlet,
  ],
  template: `
    <mat-stepper
      [linear]="linear()"
      [orientation]="orientation()"
      [selectedIndex]="selectedIndex()"
      (selectedIndexChange)="selectedIndex.set($event)"
    >
      @for (step of steps(); let i = $index; let last = $last; track step.label) {
        <mat-step [optional]="step.optional ?? false">
          <ng-template matStepLabel>{{ step.label }}</ng-template>

          @if (stepTemplates()[i]) {
            <ng-container *ngTemplateOutlet="stepTemplates()[i]" />
          }

          <div class="stepper-actions">
            @if (i > 0) {
              <button mat-button matStepperPrevious>Back</button>
            }
            @if (!last) {
              <button mat-button matStepperNext>Next</button>
            }
          </div>
        </mat-step>
      }
    </mat-stepper>
  `,
  styles: `
    .stepper-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultStepper {
  readonly steps = input.required<readonly StepDefinition[]>();
  readonly linear = input(false);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly selectedIndex = model(0);

  readonly stepTemplates = contentChildren(TemplateRef);
}
