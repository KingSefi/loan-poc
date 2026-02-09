import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BrandSwitcher } from './shell/brand-switcher/brand-switcher.component';

@Component({
  selector: 'app-root',
  imports: [BrandSwitcher, RouterOutlet],
  template: `
    <app-brand-switcher />
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
