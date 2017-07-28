import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BreadcrumbService } from '../../services/breadcrumb.service';

import { Project } from "../../models/project";

import { ProjectDAL } from '../../dal/project.dal';
import { ReportDAL } from '../../dal/report.dal';

import { CalendarHelper } from '../../helpers/calendar.helper';

import { ActivityReportComponent } from '../../widgets/activity-report';

@Component({
  providers: [ProjectDAL, ReportDAL],
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

  protected projects: Array<Project> = new Array<Project>();

  protected values: Object = new Object(); // [project.id][day.id] = float [0..1]

  protected currentMonth: Date = new Date();
  protected currentMonthName: string;

  protected reportProgress: number = 0;

  @ViewChild(ActivityReportComponent) view: ActivityReportComponent;

  constructor(
    private breadServ: BreadcrumbService,
    private projectDal: ProjectDAL,
    private reportDal: ReportDAL,
    private router: Router,
  ) {
  }

  public ngOnInit() {
    let info = this.reportDal.readInfo();

    this.reportProgress = 1;

    info.then((info: Object) => {
      let month: Date = new Date(info["currentMonth"]);
      this.selectMonth(month);
    });

    this.breadServ.set({
      header: 'Compte rendu d\'activité',
      display: true,
      levels: [
        {
          icon: 'dashboard',
          link: ['/portal'],
          title: 'Home'
        },
        {
          icon: 'calendar',
          link: ['/portal', 'report', 'submit'],
          title: 'Compte rendu d\'activité'
        },
        {
          icon: 'pencil',
          link: ['/portal', 'report', 'submit'],
          title: 'Saisie'
        },
      ]
    });
  }

  public selectMonth(month: Date): void{
    this.reportProgress = 1;
    this.currentMonth = month;
    this.currentMonthName = CalendarHelper.monthName(this.currentMonth) + " " + this.currentMonth.getFullYear();

    this.projectDal.readAll();
    this.projectDal.projects.first().subscribe((projects) => {
      this.projects = projects;
      this.reportProgress = 0;
    });
  }

  public saveReport(): void{
    this.reportProgress = 1;

    this.reportDal.saveReport(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), this.values)
      .then(() => this.reportProgress = 0)
      .catch(() => this.reportProgress = 0);
  }

  public submitReport(): void{
    this.reportProgress = 1;

    this.reportDal.submitReport(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), this.values).then(any => {
      this.ngOnInit();
    })
    .then(() => this.reportProgress = 0)
    .catch(() => this.reportProgress = 0);
  }

  public onValuesChanges(event: Object) {
    this.values = event;
  }

  public goToHistory() {
    this.router.navigate(['/portal', 'report', 'history', 'me', this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1]);
  }

}
