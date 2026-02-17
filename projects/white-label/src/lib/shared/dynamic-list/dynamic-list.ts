import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'lib-dynamic-list',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatIconButton,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
  ],
  template: `
    <div class="dynamic-list">
      @for (item of items(); let i = $index; track i) {
        <div class="list-item">
          <mat-form-field class="label-field">
            <mat-label>Libellé</mat-label>
            <input matInput [formControl]="$any(item.controls['label'])" />
          </mat-form-field>
          <mat-form-field class="amount-field">
            <mat-label>Montant (€)</mat-label>
            <input matInput type="number" [formControl]="$any(item.controls['amount'])" />
          </mat-form-field>
          <button mat-icon-button (click)="removeItem(i)" aria-label="Supprimer">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      }
      <button mat-button (click)="addItem()" class="add-button">
        <mat-icon>add</mat-icon>
        {{ addLabel() }}
      </button>
    </div>
  `,
  styles: `
    .dynamic-list {
      margin: 0.5rem 0;
    }

    .list-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      animation: fadeIn 0.3s ease-out;
    }

    .label-field {
      flex: 2;
    }

    .amount-field {
      flex: 1;
    }

    .add-button {
      margin-top: 0.25rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-8px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicList {
  readonly items = model<FormGroup[]>([]);
  readonly addLabel = input('Ajouter');

  addItem(): void {
    const group = new FormGroup({
      label: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    });
    this.items.update((list) => [...list, group]);
  }

  removeItem(index: number): void {
    this.items.update((list) => list.filter((_, i) => i !== index));
  }
}
