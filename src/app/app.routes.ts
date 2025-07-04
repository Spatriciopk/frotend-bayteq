import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard'; 

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'analysts',
    loadComponent: () => import('./features/analyst/analyst.component').then(m => m.AnalystComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'sales-management',
    loadComponent: () => import('./features/sales-management/sales-management.component').then(m => m.SalesManagementComponent),
    canActivate: [AuthGuard]
  
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];