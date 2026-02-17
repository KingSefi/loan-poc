import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  AUTH_CONFIG,
  BRAND_CONFIG,
  LOAN_CONFIG,
  ROOT_LAYOUT_TOKEN,
  SIDENAV_CONFIG,
  SidenavSection,
} from 'core';
import { DefaultSidenavLayout } from 'white-label';

import { routes } from './app.routes';

const SIDENAV_SECTIONS: readonly SidenavSection[] = [
  {
    header: 'Overview',
    items: [
      { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
      { icon: 'account_balance', label: 'Accounts', route: '/accounts' },
      { icon: 'receipt_long', label: 'Transactions', route: '/transactions' },
    ],
  },
  {
    header: 'Services',
    items: [
      { icon: 'swap_horiz', label: 'Transfers', route: '/transfers' },
      { icon: 'payment', label: 'Payments', route: '/payments' },
      { icon: 'request_quote', label: 'Loans', route: '/loans' },
      { icon: 'credit_card', label: 'Cards', route: '/cards' },
    ],
  },
  {
    header: 'Settings',
    items: [
      { icon: 'person', label: 'Profile', route: '/profile' },
      { icon: 'security', label: 'Security', route: '/security' },
    ],
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
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
};
