import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'lib-theme-switch',
  imports: [MatSlideToggle],
  template: `
    <mat-slide-toggle
      [checked]="themeService.isDark()"
      (change)="themeService.toggle()"
      aria-label="Toggle dark mode"
    >
      Dark mode
    </mat-slide-toggle>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitch {
  readonly themeService = inject(ThemeService);
}
