// external module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule, DatepickerModule, BsDropdownModule } from 'ngx-bootstrap';
import { TreeviewModule } from 'ngx-treeview';
import { SelectModule } from 'ng2-select';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

let modules = [
    AlertModule.forRoot(),
    DatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TreeviewModule.forRoot(),
    SelectModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ToasterModule
];

import { AppComponent } from './app.component';

import { AppHeaderComponent } from './widgets/app-header';
import { AppFooterComponent } from './widgets/app-footer';
import { MenuAsideComponent } from './widgets/menu-aside';
import { ControlSidebarComponent } from './widgets/control-sidebar';
import { MessagesBoxComponent } from './widgets/messages-box';
import { NotificationBoxComponent } from './widgets/notification-box';
import { TasksBoxComponent } from './widgets/tasks-box';
import { UserBoxComponent } from './widgets/user-box';
import { BreadcrumbComponent } from './widgets/breadcrumb';
import { ModalDialogComponent } from './widgets/modal-dialog';
import { AvatarComponent } from './widgets/avatar';
import { LoadingCubeComponent } from './widgets/loading-cube';
import { ActivityReportComponent } from './widgets/activity-report';
import { ReportStatusLabelComponent } from './widgets/report-status-label';

let widgets = [
    AppComponent,
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
    LoadingCubeComponent,
    ActivityReportComponent,
    ReportStatusLabelComponent,
];

import { UserService } from './services/user.service';
import { MessagesService } from './services/messages.service';
import { CanActivateGuard } from './services/guard.service';
import { CanActivateAdminGuard } from './services/admin.guard.service';
import { NotificationService } from './services/notification.service';
import { BreadcrumbService } from './services/breadcrumb.service';
import { LoggerService } from './services/logger.service';
import { RestService } from './services/rest.service';
import { AuthenticationService } from './services/authentication.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp( new AuthConfig({}), http, options);
}

let services = [
    {
        provide: AuthHttp,
        useFactory: authHttpServiceFactory,
        deps: [ Http, RequestOptions ]
    },
    UserService,
    BreadcrumbService,
    MessagesService,
    CanActivateGuard,
    CanActivateAdminGuard,
    NotificationService,
    LoggerService,
    RestService,
    AuthenticationService,
];

// les pages
import { HomeComponent } from './pages/home/home.component';
import { ClientComponent } from './pages/client/client.component';
import { ProjectComponent } from './pages/project/project.component';
import { LayoutsAuthComponent } from './pages/layouts/auth/auth';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/login/registration.component';
import { UserComponent } from './pages/user/user.component';
import { ProfileComponent } from './pages/user/profile.component';
import { ReportComponent } from './pages/report/report.component';
import { ReportHistoryComponent } from './pages/report/report.history.component';
import { ReportValidationComponent } from './pages/report/report.validation.component';

let pages = [
    HomeComponent,
    ClientComponent,
    ProjectComponent,
    LayoutsAuthComponent,
    LoginComponent,
    RegistrationComponent,
    ReportComponent,
    ReportHistoryComponent,
    ReportValidationComponent,
    UserComponent,
    ProfileComponent,
];

// main bootstrap
import { routing } from './app.routes';

import { Configuration } from './app.constants';

@NgModule( {
    bootstrap: [AppComponent],
    declarations: [
        ...widgets,
        ...pages
    ],
    imports: [
        ...modules,
        routing
    ],
    providers: [
        ...services,
        Configuration
    ]
})
export class AppModule { }
