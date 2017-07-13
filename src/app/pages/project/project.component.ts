import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BreadcrumbService } from '../../services/breadcrumb.service';
import { RestService } from "../../services/rest.service";

import { ProjectDAL } from '../../dal/project.dal';
import { ClientDAL } from '../../dal/client.dal';

import { Project } from '../../models/project';
import { Client } from '../../models/client';

@Component({
  providers: [ProjectDAL, ClientDAL],
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit, OnDestroy {
  protected projects: Array<Project> = new Array<Project>();
  protected clients: Array<Client> = new Array<Client>();

  protected newProject: Project;
  protected projectsStatus: Array<Object> = new Array<Object>();

  protected projectsProgress: number = 0;
  protected addProgress: number = 0;

  constructor(
    private projectDal: ProjectDAL,
    private clientDal: ClientDAL,
    private breadServ: BreadcrumbService
  ) {
  }

  public ngOnInit() {
    this.projectsProgress = 2;

    this.projectDal.readAll();
    this.projectDal.projects.subscribe((projects) => {
      this.projects = projects;
      if (this.projectsProgress) this.projectsProgress--;
    });

    this.clientDal.readAll();
    this.clientDal.clients.subscribe((clients) => {
      this.clients = clients;
      if (this.projectsProgress) this.projectsProgress--;
    });

    this.newProject = new Project();

    this.projectsStatus = Project.statusArray();

    this.breadServ.set({
      header: 'Gestion des projets',
      display: true,
      levels: [
        {
          icon: 'dashboard',
          link: ['/'],
          title: 'Home'
        },
        {
          icon: 'clock-o',
          link: ['/projects'],
          title: 'Project'
        }
      ]
    });

  }

  public ngOnDestroy() {
    this.breadServ.clear();
    this.projects = null;
  }

  private saveProject = (project: Project): void => {
    this.projectsProgress = 1;

    this.projectDal.save(new Project(project))
      .then(() => this.projectsProgress = 0)
      .catch(() => this.projectsProgress = 0);
  }

  private deleteProject = (project: Project): void => {
    this.projectsProgress = 1;

    this.projectDal.delete(project)
      .then(() => this.projectsProgress = 0)
      .catch(() => this.projectsProgress = 0);
  }

  private add = (): void => {
    this.addProgress = 1;

    this.newProject.status = Project.StatusActive;
    this.projectDal.create(new Project(this.newProject)).then(any => {
      this.newProject = new Project();
    })
    .then(() => this.addProgress = 0)
    .catch(() => this.addProgress = 0);
  }
}
