import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TOPNAV_CONFIG } from 'core';

import { DefaultHeader } from '../../header/default-header/default-header';

@Component({
  selector: 'lib-topnav-layout',
  imports: [
    DefaultHeader, RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbar, MatAnchor, MatButton, MatIcon, MatMenuModule,
  ],
  templateUrl: './topnav-layout.html',
  styleUrl: './topnav-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultTopNavLayout {
  readonly menuGroups = inject(TOPNAV_CONFIG);
}
