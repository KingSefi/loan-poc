import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WhiteLabelRoot } from 'white-label';

@Component({
  selector: 'app-root',
  imports: [WhiteLabelRoot],
  template: '<lib-white-label-root />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
