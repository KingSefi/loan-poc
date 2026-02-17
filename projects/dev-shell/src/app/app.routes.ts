import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'green',
    loadComponent: () =>
      import('./wrappers/green-wrapper/green-wrapper.component').then((m) => m.GreenWrapper),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('white-label').then((m) => m.DefaultDashboard),
      },
      {
        path: 'loans/apply',
        loadComponent: () => import('white-label').then((m) => m.LoanApplication),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'purple',
    loadComponent: () =>
      import('./wrappers/purple-wrapper/purple-wrapper.component').then((m) => m.PurpleWrapper),
    children: [
      {
        path: 'home',
        loadComponent: () => import('white-label').then((m) => m.DefaultHomePage),
      },
      {
        path: 'loans/apply',
        loadComponent: () => import('white-label').then((m) => m.LoanApplication),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'blue',
    loadComponent: () =>
      import('./wrappers/blue-wrapper/blue-wrapper.component').then((m) => m.BlueWrapper),
    children: [
      {
        path: 'home',
        loadComponent: () => import('white-label').then((m) => m.DefaultHomePage),
      },
      {
        path: 'mortgage/apply',
        loadComponent: () => import('white-label').then((m) => m.GuidedWizard),
      },
      {
        path: 'simulator',
        loadComponent: () => import('white-label').then((m) => m.LoanSimulator),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'green', pathMatch: 'full' },
];
