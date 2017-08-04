import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { BreadcrumbService } from '../../services/breadcrumb.service';

import { ProjectDAL } from '../../dal/project.dal';
import { ReportDAL } from '../../dal/report.dal';
import { UserDAL } from '../../dal/user.dal';
import { ClientDAL } from '../../dal/client.dal';

import { Project } from '../../models/project';
import { User } from '../../models/user';
import { Client } from '../../models/client';

@Component({
  providers: [ProjectDAL, ReportDAL, UserDAL, ClientDAL],
  templateUrl: './project.details.component.html'
})
export class ProjectDetailsComponent implements OnInit {

  protected project: Project = new Project();
  protected users: Array<User> = [];
  protected clients: Array<Client> = [];
  protected projectsStatus: Array<Object> = new Array<Object>();

  protected resumeProgress: number = 0;

  protected reportMonth: Date = new Date();
  protected reportMonthDropdownOpen: boolean = false;

  constructor(
    private projectDal: ProjectDAL,
    private userDal: UserDAL,
    private clientDal: ClientDAL,
    private breadServ: BreadcrumbService,
    private route: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadProject(+params['id']);
    });

    this.clientDal.readAll();
    this.clientDal.clients.subscribe((clients) => {
      this.clients = clients;
    });

    this.projectsStatus = Project.statusArray();
  }

  public loadProject(id: number) {
    this.resumeProgress = 1;

    this.projectDal.read(id).first().subscribe(project => {
      this.breadServ.set({
        header: project.name,
        description: 'Gestion des projets',
        display: true,
        levels: [
          {
            icon: 'dashboard',
            link: ['/portal'],
            title: 'Home'
          },
          {
            icon: 'briefcase',
            link: ['/portal', 'projects'],
            title: 'Projets'
          },
          {
            icon: 'briefcase',
            link: ['/portal', 'projects', project.id],
            title: project.name
          }
        ]
      });

      this.project = project;

      this.userDal.readByActivity(project).then(users => {
        this.users = users;

        this.resumeProgress = 0;
      });
    })
  }

  public saveProject() {
    this.resumeProgress = 1;

    this.projectDal.save(new Project(this.project))
      .then(() => this.resumeProgress = 0)
      .catch(() => this.resumeProgress = 0);
  }

  public toggleReportMonthDropdown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.reportMonthDropdownOpen = !this.reportMonthDropdownOpen;
  }

  public selectReportMonth(event: Date) {
    this.reportMonth = event;
    this.reportMonthDropdownOpen = false;
  }

  public reportMonthNext() {
    if (this.reportMonth.getMonth() == 11) {
        this.reportMonth = new Date(this.reportMonth.getFullYear() + 1, 0, 1);
    } else {
        this.reportMonth = new Date(this.reportMonth.getFullYear(), this.reportMonth.getMonth() + 1, 1);
    }
    this.reportMonthDropdownOpen = false;
  }

  public reportMonthPrevious() {
    if (this.reportMonth.getMonth() == 0) {
        this.reportMonth = new Date(this.reportMonth.getFullYear() - 1, 11, 1);
    } else {
        this.reportMonth = new Date(this.reportMonth.getFullYear(), this.reportMonth.getMonth() - 1, 1);
    }
    this.reportMonthDropdownOpen = false;
  }

}
