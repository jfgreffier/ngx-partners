import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuard } from './services/guard.service';

// Components
import { HomeComponent } from './pages/home/home.component';
import { ClientComponent } from './pages/client/client.component';
import { ProjectComponent } from './pages/project/project.component';
import { LayoutsAuthComponent } from './pages/layouts/auth/auth';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/login/registration.component';
import { ReportComponent } from './pages/report/report.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  // logged routes
  {
    canActivate: [CanActivateGuard],
    children: [
      {
        canActivate: [CanActivateGuard],
        component: HomeComponent,
        path: 'home'
      },
      {
        canActivate: [CanActivateGuard],
        component: ReportComponent,
        path: 'report'
      },
      {
        canActivate: [CanActivateGuard],
        component: ClientComponent,
        path: 'clients'
      },
      {
        canActivate: [CanActivateGuard],
        component: ClientComponent,
        path: 'clients/:id'
      },
      {
        canActivate: [CanActivateGuard],
        component: ProjectComponent,
        path: 'projects'
      },
      {
        canActivate: [CanActivateGuard],
        component: UserComponent,
        path: 'users'
      },
    ],
    component: LayoutsAuthComponent,
    path: '',
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
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
