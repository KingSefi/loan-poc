import type { FormGroup } from '@angular/forms';

export interface WizardStep {
  readonly form: FormGroup;
}
