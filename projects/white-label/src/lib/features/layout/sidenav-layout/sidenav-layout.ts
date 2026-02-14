import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatListSubheaderCssMatStyler, MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SIDENAV_CONFIG } from 'core';

import { DefaultHeader } from '../../header/default-header/default-header';

@Component({
  selector: 'lib-sidenav-layout',
  imports: [
    DefaultHeader,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatNavList,
    MatListItem,
    MatListSubheaderCssMatStyler,
    MatIcon,
    MatDivider,
  ],
  templateUrl: './sidenav-layout.html',
  styleUrl: './sidenav-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultSidenavLayout {
  readonly sections = inject(SIDENAV_CONFIG);
}
