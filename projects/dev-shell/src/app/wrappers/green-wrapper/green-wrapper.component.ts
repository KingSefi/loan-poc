import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  AUTH_CONFIG,
  BRAND_CONFIG,
  LOAN_CONFIG,
  ROOT_LAYOUT_TOKEN,
  SIDENAV_CONFIG,
  SidenavSection,
} from 'core';
import { DefaultSidenavLayout, ThemeService, WhiteLabelRoot } from 'white-label';

const SIDENAV_SECTIONS: readonly SidenavSection[] = [
  {
    header: 'Overview',
    items: [
      { icon: 'dashboard', label: 'Dashboard', route: 'dashboard' },
      { icon: 'account_balance', label: 'Accounts' },
      { icon: 'receipt_long', label: 'Transactions' },
    ],
  },
  {
    header: 'Services',
    items: [
      { icon: 'swap_horiz', label: 'Transfers' },
      { icon: 'payment', label: 'Payments' },
      { icon: 'request_quote', label: 'Loans' },
      { icon: 'credit_card', label: 'Cards' },
    ],
  },
  {
    header: 'Settings',
    items: [
      { icon: 'person', label: 'Profile' },
      { icon: 'security', label: 'Security' },
    ],
  },
];

@Component({
  selector: 'app-green-wrapper',
  imports: [WhiteLabelRoot],
  template: '<lib-white-label-root />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: BRAND_CONFIG,
      useValue: {
        name: 'GreenBank',
        primaryColor: '#0f5132',
        theme: 'light' as const,
      },
    },
    {
      provide: AUTH_CONFIG,
      useValue: {
        provider: 'google' as const,
        sessionDurationSeconds: 3600,
        loginUrl: '/api/auth/login',
      },
    },
    {
      provide: ROOT_LAYOUT_TOKEN,
      useValue: DefaultSidenavLayout,
    },
    {
      provide: SIDENAV_CONFIG,
      useValue: SIDENAV_SECTIONS,
    },
    {
      provide: LOAN_CONFIG,
      useValue: {
        minAmount: 1000,
        maxAmount: 50_000,
        minTermMonths: 12,
        maxTermMonths: 60,
        purposes: [
          'Home Improvement',
          'Debt Consolidation',
          'Education',
          'Medical Expenses',
          'Vehicle Purchase',
          'Other',
        ],
        incomeVerification: 'self-declared' as const,
        requiresEmployerVerification: false,
      },
    },
  ],
})
export class GreenWrapper implements OnInit {
  private readonly themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.theme.set('light');
    this.themeService.brandClass.set(null);
  }
}
