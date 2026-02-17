import type { AbstractControl } from '@angular/forms';

export interface StepDefinition {
  readonly label: string;
  readonly optional?: boolean;
  readonly stepControl?: AbstractControl;
}
