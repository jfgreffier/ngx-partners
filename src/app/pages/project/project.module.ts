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

import { ProjectComponent }   from './project.component';
import { ProjectDetailsComponent }   from './project.details.component';

let pages = [
    ProjectComponent,
    ProjectDetailsComponent,
];

import { ProjectRoutingModule } from './project.routing';

@NgModule({
    declarations: [
        ...pages,
    ],
    imports: [
        ...modules,
        ProjectRoutingModule
    ],
    exports: [],
    providers: [],
})
export class ProjectModule { }