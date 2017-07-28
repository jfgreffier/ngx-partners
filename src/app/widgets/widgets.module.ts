import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TreeviewModule } from 'ngx-treeview';

import { LoadingModule } from './loading.module';

let modules = [
    CommonModule,
    FormsModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    TreeviewModule,
    LoadingModule,
];

import { AppHeaderComponent } from './app-header';
import { AppFooterComponent } from './app-footer';
import { MenuAsideComponent } from './menu-aside';
import { ControlSidebarComponent } from './control-sidebar';
import { MessagesBoxComponent } from './messages-box';
import { NotificationBoxComponent } from './notification-box';
import { TasksBoxComponent } from './tasks-box';
import { UserBoxComponent } from './user-box';
import { BreadcrumbComponent } from './breadcrumb';
import { ModalDialogComponent } from './modal-dialog';
import { AvatarComponent } from './avatar';
import { LoadingCubeComponent } from './loading-cube';
import { ActivityReportComponent } from './activity-report';
import { ReportStatusLabelComponent } from './report-status-label';

let widgets = [
    BreadcrumbComponent,
    AppHeaderComponent,
    AppFooterComponent,
    MenuAsideComponent,
    ControlSidebarComponent,
    MessagesBoxComponent,
    NotificationBoxComponent,
    TasksBoxComponent,
    UserBoxComponent,
    ModalDialogComponent,
    AvatarComponent,
    ActivityReportComponent,
    ReportStatusLabelComponent,
];

@NgModule({
    declarations: [
        ...widgets,

    ],
    imports: [
        ...modules,
    ],
    exports: [
        ...widgets,
        LoadingModule,
    ],
    providers: [],
})
export class WidgetsModule { }