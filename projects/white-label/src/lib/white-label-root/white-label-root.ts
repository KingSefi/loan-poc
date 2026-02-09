import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ROOT_LAYOUT_TOKEN } from 'core';

@Component({
  selector: 'lib-white-label-root',
  imports: [NgComponentOutlet],
  templateUrl: './white-label-root.html',
  styleUrl: './white-label-root.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhiteLabelRoot {
  readonly layoutComponent = inject(ROOT_LAYOUT_TOKEN);
}
