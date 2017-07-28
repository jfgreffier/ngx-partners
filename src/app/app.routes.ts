import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuard } from './services/guard.service';
import { CanActivateAdminGuard } from './services/admin.guard.service';

// Components
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/login/registration.component';

const routes: Routes = [
  // logged routes
  {
    canActivate: [CanActivateGuard],
    loadChildren: './main.module#MainModule',
    path: 'portal',
  },
  // not logged routes
  {
    component: LoginComponent,
    path: 'login'
  },
  {
    component: RegistrationComponent,
    path: 'registration/:token'
  },
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: '/login',
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
