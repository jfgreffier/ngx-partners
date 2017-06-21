import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Project } from '../../models/project';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { RestService } from "../../services/rest.service";
import { ProjectDAL } from '../../dal/project.dal';

import { Configuration } from '../../app.constants';

@Component({
  providers: [ProjectDAL],
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit, OnDestroy {
  private projects: Observable<Array<Project>>;

  constructor(private dal: ProjectDAL, private breadServ: BreadcrumbService) {

  }

  public ngOnInit() {
    this.projects = this.dal.readAll();
    this.breadServ.set({
      description: 'This is our Projects page',
      display: true,
      levels: [
        {
          icon: 'dashboard',
          link: ['/'],
          title: 'Home'
        },
        {
          icon: 'clock-o',
          link: ['/project'],
          title: 'Project'
        }
      ]
    });

  }

  public ngOnDestroy() {
    this.breadServ.clear();
    this.projects = null;
  }

  private save = (project: Project): void => {
    this.dal.update(project.id, project);
  }

  private delete = (project: Project): void => {
    this.dal.delete(project);
  }

  private add = (): void => {
    this.dal.create(new Project());
  }
}
