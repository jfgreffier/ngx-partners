import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WidgetsModule } from '../../widgets/widgets.module';

let modules = [
    CommonModule,
    FormsModule,
    WidgetsModule,
];

import { ClientComponent }   from './client.component';

let pages = [
    ClientComponent,
];

import { ClientRoutingModule } from './client.routing';

@NgModule({
    declarations: [
        ...pages,
    ],
    imports: [
        ...modules,
        ClientRoutingModule
    ],
    exports: [],
    providers: [],
})
export class ClientModule { }