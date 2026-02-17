import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-question-block',
  template: `
    @if (visible()) {
      <div class="question-block">
        <label class="question-label">{{ label() }}</label>
        <div class="question-content">
          <ng-content />
        </div>
      </div>
    }
  `,
  styles: `
    .question-block {
      margin: 1rem 0;
      animation: slideDown 0.3s ease-out;
    }

    .question-label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .question-content {
      padding-left: 0.25rem;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionBlock {
  readonly label = input.required<string>();
  readonly visible = input(true);
}
