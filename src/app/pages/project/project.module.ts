import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WidgetsModule } from '../../widgets/widgets.module';

let modules = [
    CommonModule,
    FormsModule,
    WidgetsModule,
];

import { ProjectComponent }   from './project.component';

let pages = [
    ProjectComponent,
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