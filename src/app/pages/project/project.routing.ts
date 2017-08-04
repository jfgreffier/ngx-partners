import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectComponent } from './project.component';
import { ProjectDetailsComponent } from './project.details.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
  },
  {
    path: ':id',
    component: ProjectDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule { }