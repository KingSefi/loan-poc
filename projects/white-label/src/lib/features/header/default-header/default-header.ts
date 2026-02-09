import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { BRAND_CONFIG } from 'core';

import { ThemeSwitch } from '../../theme-switch';

@Component({
  selector: 'lib-default-header',
  imports: [MatToolbar, MatIconButton, MatIcon, ThemeSwitch],
  templateUrl: './default-header.html',
  styleUrl: './default-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'banner' },
})
export class DefaultHeader {
  private readonly brandConfig = inject(BRAND_CONFIG, { optional: true });

  readonly title = input<string>('');
  readonly menuOpen = signal(false);

  readonly brandName = computed(() => this.brandConfig?.name ?? 'App');
  readonly displayTitle = computed(() => this.title() || this.brandName());

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
