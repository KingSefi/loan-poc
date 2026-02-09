import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { AUTH_CONFIG, BRAND_CONFIG, MenuGroup, ROOT_LAYOUT_TOKEN, TOPNAV_CONFIG } from 'core';
import { DefaultTopNavLayout } from 'white-label';

import { routes } from './app.routes';

const TOPNAV_MENUS: readonly MenuGroup[] = [
  { icon: 'home', label: 'Home', route: '/home' },
  {
    icon: 'account_balance', label: 'Accounts',
    children: [
      { icon: 'account_balance_wallet', label: 'Checking' },
      { icon: 'savings', label: 'Savings' },
      { icon: 'credit_card', label: 'Credit Cards' },
      { icon: 'account_balance', label: 'Certificates of Deposit' },
    ],
  },
  {
    icon: 'payment', label: 'Payments',
    children: [
      { icon: 'swap_horiz', label: 'Transfer Funds' },
      { icon: 'send', label: 'Send Money' },
      { icon: 'receipt', label: 'Pay Bills' },
      { icon: 'schedule', label: 'Scheduled Payments' },
    ],
  },
  {
    icon: 'trending_up', label: 'Invest',
    children: [
      { icon: 'show_chart', label: 'Portfolio' },
      { icon: 'candlestick_chart', label: 'Trading' },
      { icon: 'pie_chart', label: 'Mutual Funds' },
      { icon: 'elderly', label: 'Retirement' },
    ],
  },
  {
    icon: 'request_quote', label: 'Loans',
    children: [
      { icon: 'house', label: 'Mortgage' },
      { icon: 'directions_car', label: 'Auto Loan' },
      { icon: 'person', label: 'Personal Loan' },
      { icon: 'school', label: 'Student Loan' },
    ],
  },
  {
    icon: 'help_outline', label: 'Support',
    children: [
      { icon: 'chat', label: 'Live Chat' },
      { icon: 'phone', label: 'Call Us' },
      { icon: 'location_on', label: 'Find a Branch' },
      { icon: 'article', label: 'FAQ' },
    ],
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(),
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
  ],
};
