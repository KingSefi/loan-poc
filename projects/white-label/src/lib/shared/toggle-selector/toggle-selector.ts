import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';

export interface ToggleOption {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'lib-toggle-selector',
  imports: [MatButtonToggleGroup, MatButtonToggle],
  template: `
    <mat-button-toggle-group
      [value]="selected()"
      (change)="selected.set($event.value)"
      [attr.aria-label]="ariaLabel()"
    >
      @for (option of options(); track option.value) {
        <mat-button-toggle [value]="option.value" [attr.aria-label]="option.label">
          {{ option.label }}
        </mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
  styles: `
    :host {
      display: block;
      margin: 0.5rem 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSelector {
  readonly options = input.required<readonly ToggleOption[]>();
  readonly selected = model<string | null>(null);
  readonly ariaLabel = input('Select an option');
}
