import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanActivateAdminGuard } from '../../services/admin.guard.service';

import { UserComponent } from './user.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
    {
        canActivate: [CanActivateAdminGuard],
        component: UserComponent,
        path: ''
    },
    {
        component: ProfileComponent,
        path: 'me'
    },
    {
        canActivate: [CanActivateAdminGuard],
        component: ProfileComponent,
        path: ':id'
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule { }