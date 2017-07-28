import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

let modules = [
    CommonModule,
];

import { LoadingCubeComponent } from './loading-cube';

@NgModule({
    declarations: [
        LoadingCubeComponent,

    ],
    exports: [
        LoadingCubeComponent,
    ],
    providers: [],
})
export class LoadingModule { }