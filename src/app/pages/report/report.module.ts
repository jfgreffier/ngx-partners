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

import { ReportComponent } from './report.component';
import { ReportHistoryComponent } from './report.history.component';
import { ReportValidationComponent } from './report.validation.component';

let pages = [
    ReportComponent,
    ReportHistoryComponent,
    ReportValidationComponent,
];

import { ReportRoutingModule } from './report.routing';

@NgModule({
    declarations: [
        ...pages,
    ],
    imports: [
        ...modules,
        ReportRoutingModule
    ],
    exports: [],
    providers: [],
})
export class ReportModule { }