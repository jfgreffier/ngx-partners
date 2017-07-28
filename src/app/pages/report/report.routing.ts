import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanActivateAdminGuard } from '../../services/admin.guard.service';

import { ReportComponent } from './report.component';
import { ReportHistoryComponent } from './report.history.component';
import { ReportValidationComponent } from './report.validation.component';

const routes: Routes = [
    {
        component: ReportComponent,
        path: 'submit'
    },
    {
        component: ReportHistoryComponent,
        path: 'history/:user'
    },
    {
        component: ReportHistoryComponent,
        path: 'history/:user/:year/:month'
    },
    {
        canActivate: [CanActivateAdminGuard],
        component: ReportValidationComponent,
        path: 'validation/:user'
    },
    {
        canActivate: [CanActivateAdminGuard],
        component: ReportValidationComponent,
        path: 'validation/:user/:year/:month'
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportRoutingModule { }