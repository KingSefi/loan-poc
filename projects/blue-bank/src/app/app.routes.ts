import { Routes } from '@angular/router';

export const routes: Routes = [
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
];
