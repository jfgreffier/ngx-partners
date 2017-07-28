import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuard } from './services/guard.service';
import { CanActivateAdminGuard } from './services/admin.guard.service';

// Components
import { HomeComponent } from './pages/home/home.component';
import { LayoutsAuthComponent } from './pages/layouts/auth/auth';

const routes: Routes = [
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
        loadChildren: './pages/report/report.module#ReportModule',
        path: 'report'
      },
      {
        canActivate: [CanActivateAdminGuard],
        loadChildren: './pages/client/client.module#ClientModule',
        path: 'clients'
      },
      {
        canActivate: [CanActivateAdminGuard],
        loadChildren: './pages/project/project.module#ProjectModule',
        path: 'projects'
      },
      {
        canActivate: [CanActivateGuard],
        loadChildren: './pages/user/user.module#UserModule',
        path: 'users'
      },
    ],
    component: LayoutsAuthComponent,
    path: '',
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainRoutingModule { }