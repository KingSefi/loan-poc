import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-switcher',
  imports: [MatButtonToggleGroup, MatButtonToggle],
  templateUrl: './brand-switcher.component.html',
  styleUrl: './brand-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandSwitcher {
  private readonly router = inject(Router);

  onBrandChange(event: MatButtonToggleChange): void {
    this.router.navigateByUrl(event.value);
  }
}
