import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  AUTH_CONFIG,
  BRAND_CONFIG,
  LOAN_CONFIG,
  MenuGroup,
  ROOT_LAYOUT_TOKEN,
  TOPNAV_CONFIG,
} from 'core';
import { DefaultTopNavLayout, ThemeService, WhiteLabelRoot } from 'white-label';

const TOPNAV_MENUS: readonly MenuGroup[] = [
  { icon: 'home', label: 'Home', route: 'home' },
  {
    icon: 'account_balance',
    label: 'Accounts',
    children: [
      { icon: 'account_balance_wallet', label: 'Checking' },
      { icon: 'savings', label: 'Savings' },
      { icon: 'credit_card', label: 'Credit Cards' },
    ],
  },
  {
    icon: 'payment',
    label: 'Payments',
    children: [
      { icon: 'swap_horiz', label: 'Transfer Funds' },
      { icon: 'send', label: 'Send Money' },
      { icon: 'receipt', label: 'Pay Bills' },
    ],
  },
  {
    icon: 'request_quote',
    label: 'Loans',
    children: [
      { icon: 'house', label: 'Mortgage' },
      { icon: 'directions_car', label: 'Auto Loan' },
      { icon: 'person', label: 'Personal Loan' },
    ],
  },
  {
    icon: 'help_outline',
    label: 'Support',
    children: [
      { icon: 'chat', label: 'Live Chat' },
      { icon: 'phone', label: 'Call Us' },
    ],
  },
];

@Component({
  selector: 'app-purple-wrapper',
  imports: [WhiteLabelRoot],
  template: '<lib-white-label-root />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: BRAND_CONFIG,
      useValue: {
        name: 'PurpleBank',
        primaryColor: '#6b21a8',
        theme: 'dark' as const,
      },
    },
    {
      provide: AUTH_CONFIG,
      useValue: {
        provider: 'microsoft' as const,
        sessionDurationSeconds: 7200,
        loginUrl: '/api/auth/login',
      },
    },
    {
      provide: ROOT_LAYOUT_TOKEN,
      useValue: DefaultTopNavLayout,
    },
    {
      provide: TOPNAV_CONFIG,
      useValue: TOPNAV_MENUS,
    },
    {
      provide: LOAN_CONFIG,
      useValue: {
        minAmount: 5000,
        maxAmount: 100_000,
        minTermMonths: 6,
        maxTermMonths: 84,
        purposes: [
          'Home Renovation',
          'Business Investment',
          'Debt Consolidation',
          'Travel',
          'Wedding',
          'Other',
        ],
        incomeVerification: 'payslip-upload' as const,
        requiresEmployerVerification: true,
      },
    },
  ],
})
export class PurpleWrapper implements OnInit {
  private readonly themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.theme.set('dark');
    this.themeService.brandClass.set('purple-brand');
  }
}
