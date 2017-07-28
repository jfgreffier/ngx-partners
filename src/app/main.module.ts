// external module
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';

import { WidgetsModule } from './widgets/widgets.module';

let modules = [
    CommonModule,
    RouterModule,
    ToasterModule,
    WidgetsModule,
];

import { MessagesService } from './services/messages.service';
import { NotificationService } from './services/notification.service';
import { BreadcrumbService } from './services/breadcrumb.service';

let services = [
    BreadcrumbService,
    MessagesService,
    NotificationService,
];

// les pages
import { HomeComponent } from './pages/home/home.component';
import { LayoutsAuthComponent } from './pages/layouts/auth/auth';

let pages = [
    HomeComponent,
    LayoutsAuthComponent,
];

import { MainRoutingModule } from './main.routing';

@NgModule({
    declarations: [
        ...pages
    ],
    imports: [
        ...modules,
        MainRoutingModule,
    ],
    providers: [
        ...services,
    ]
})
export class MainModule { }
