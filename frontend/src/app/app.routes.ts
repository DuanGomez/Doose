import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'login',    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'portafolio', loadComponent: () => import('./features/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
  { path: 'servicios',  loadComponent: () => import('./features/services/services.component').then(m => m.ServicesComponent) },
  { path: 'contacto',   loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent) },
  {
    path: 'favoritos',
    loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',  loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'servicios',  loadComponent: () => import('./features/admin/services-crud/services-crud.component').then(m => m.ServicesCrudComponent) },
      { path: 'portafolio', loadComponent: () => import('./features/admin/portfolio-crud/portfolio-crud.component').then(m => m.PortfolioCrudComponent) },
      { path: 'usuarios',   loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent) },
      { path: 'mensajes',   loadComponent: () => import('./features/admin/messages/messages.component').then(m => m.MessagesComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
