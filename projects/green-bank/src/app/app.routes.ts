import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('white-label').then((m) => m.DefaultDashboard),
  },
  {
    path: 'loans/apply',
    loadComponent: () => import('white-label').then((m) => m.LoanApplication),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
