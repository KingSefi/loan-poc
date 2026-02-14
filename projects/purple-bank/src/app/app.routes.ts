import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('white-label').then((m) => m.DefaultHomePage),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
