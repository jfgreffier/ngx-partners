// external module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { LoadingModule } from './widgets/loading.module';

let modules = [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    LoadingModule,
];

import { AppComponent } from './app.component';

let widgets = [
    AppComponent,
];

import { UserService } from './services/user.service';
import { CanActivateGuard } from './services/guard.service';
import { CanActivateAdminGuard } from './services/admin.guard.service';
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
    CanActivateGuard,
    CanActivateAdminGuard,
    RestService,
    AuthenticationService,
];

// les pages
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/login/registration.component';
import { RedirectComponent } from './pages/login/redirect.component';
import { CASComponent } from './pages/login/cas.component';

let pages = [
    LoginComponent,
    RegistrationComponent,
    RedirectComponent,
    CASComponent,
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
