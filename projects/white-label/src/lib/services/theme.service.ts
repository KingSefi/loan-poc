import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { BRAND_CONFIG } from 'core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly brandConfig = inject(BRAND_CONFIG, { optional: true });

  readonly theme = signal<'light' | 'dark'>(this.brandConfig?.theme ?? 'light');
  readonly isDark = computed(() => this.theme() === 'dark');
  readonly brandClass = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      const dark = this.isDark();
      const doc = document.documentElement;
      doc.classList.toggle('dark-theme', dark);
      doc.classList.toggle('light-theme', !dark);
    });

    effect((onCleanup) => {
      const cls = this.brandClass();
      if (cls) {
        document.documentElement.classList.add(cls);
        onCleanup(() => document.documentElement.classList.remove(cls));
      }
    });
  }

  toggle(): void {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }
}
