import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatepickerModule, BsDropdownModule } from 'ngx-bootstrap';
import { SelectModule } from 'ng2-select';
import { TreeviewModule } from 'ngx-treeview';

import { WidgetsModule } from '../../widgets/widgets.module';

let modules = [
    CommonModule,
    FormsModule,
    DatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    SelectModule,
    TreeviewModule.forRoot(),
    WidgetsModule,
];

import { UserComponent } from './user.component';
import { ProfileComponent } from './profile.component';

let pages = [
    UserComponent,
    ProfileComponent,
];

import { UserRoutingModule } from './user.routing';

@NgModule({
    declarations: [
        ...pages,
    ],
    imports: [
        ...modules,
        UserRoutingModule
    ],
    exports: [],
    providers: [],
})
export class UserModule { }