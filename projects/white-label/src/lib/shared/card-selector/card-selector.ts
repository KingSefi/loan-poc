import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

export interface CardOption {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly description?: string;
}

@Component({
  selector: 'lib-card-selector',
  imports: [MatCard, MatCardContent, MatIcon],
  template: `
    <div class="card-grid" role="radiogroup" [attr.aria-label]="ariaLabel()">
      @for (option of options(); track option.id) {
        <mat-card
          class="selectable-card"
          [class.selected]="isSelected(option.id)"
          (click)="select(option.id)"
          (keydown.enter)="select(option.id)"
          (keydown.space)="select(option.id); $event.preventDefault()"
          role="radio"
          [attr.aria-checked]="isSelected(option.id)"
          tabindex="0"
          [attr.aria-label]="option.label"
        >
          <mat-card-content>
            @if (option.icon) {
              <mat-icon class="card-icon">{{ option.icon }}</mat-icon>
            }
            <span class="card-label">{{ option.label }}</span>
            @if (option.description) {
              <span class="card-description">{{ option.description }}</span>
            }
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: `
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .selectable-card {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.selected {
        border-color: var(--mat-sys-primary, #1976d2);
        background: color-mix(in srgb, var(--mat-sys-primary, #1976d2) 8%, transparent);
      }

      mat-card-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.5rem;
        padding: 1rem;
      }
    }

    .card-icon {
      font-size: 2rem;
      width: 32px;
      height: 32px;
      color: var(--mat-sys-primary, #1976d2);
    }

    .card-label {
      font-weight: 500;
    }

    .card-description {
      font-size: 0.8rem;
      opacity: 0.7;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSelector {
  readonly options = input.required<readonly CardOption[]>();
  readonly selected = model<string | null>(null);
  readonly multi = input(false);
  readonly multiSelected = model<string[]>([]);
  readonly ariaLabel = input('Select an option');

  protected isSelected(id: string): boolean {
    if (this.multi()) {
      return this.multiSelected().includes(id);
    }
    return this.selected() === id;
  }

  protected select(id: string): void {
    if (this.multi()) {
      const current = this.multiSelected();
      this.multiSelected.set(
        current.includes(id) ? current.filter((v) => v !== id) : [...current, id],
      );
    } else {
      this.selected.set(id);
    }
  }

  protected readonly selectedOptions = computed(() => {
    if (this.multi()) {
      return this.multiSelected();
    }
    const val = this.selected();
    return val ? [val] : [];
  });
}
