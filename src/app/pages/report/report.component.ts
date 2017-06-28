import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BreadcrumbService } from '../../services/breadcrumb.service';

import { Project } from "../../models/project";

import { ProjectDAL } from '../../dal/project.dal';

import { CalendarHelper } from '../../helpers/calendar.helper';

class Day {
  public day: number;
  public working: boolean;
}

@Component({
  providers: [ProjectDAL],
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

  private activities: Array<string>;
  private projects: Promise<Array<Project>>;
  private shownProjects: Array<Project>;
  private days: Array<Day>;

  private currentMonth: Date;
  private currentMonthName: string;

  // used by add-project dialog
  private selectedProjectId: number = -1;

  constructor(
    private breadServ: BreadcrumbService,
    private projectDal: ProjectDAL,
  ) {
  }

  public ngOnInit() {
    this.days = new Array<Day>();
    this.shownProjects = new Array<Project>();
    this.projects = Observable.of(new Array<Project>()).toPromise();

    this.activities = new Array("Geeking Days", "Formation", "CP", "Maladie", "Abs. exceptionnelle", "Congé sans solde");

    this.selectMonth(new Date());

    this.breadServ.set({
      description: 'Compte rendu d\'activité',
      display: true,
      levels: [
        {
          icon: 'dashboard',
          link: ['/'],
          title: 'Home'
        },
        {
          icon: 'calendar',
          link: ['/report'],
          title: 'Compte rendu d\'activité'
        }
      ]
    });
  }

  public selectMonth(month: Date): void{
    this.currentMonth = new Date();

    this.projects = this.projectDal.readAll().toPromise();

    this.currentMonthName = CalendarHelper.monthName(this.currentMonth) + " " + this.currentMonth.getFullYear();

    this.projects.then((parray) => {
      parray.forEach(p => {
        if (true){ // if we have reports on this projects
          this.shownProjects.push(p);
        }
      })
    });

    for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++){
      let d = new Day;
      d.day = i;
      d.working = CalendarHelper.isWorkingDay(new Date(this.currentMonth.getFullYear(), this.currentMonth.getUTCMonth(), i));
      this.days.push(d);
    }
  }

  public addProject(): void{
    this.projects.then(projects => {
      let project = projects.find(it => {
        return it.id == this.selectedProjectId;
      })

      if (project == null) return;

      if (!this.isShown(project)){
        this.shownProjects.push(project);
      }
    });
  }

  public removeProject(p: Project): void{
    if (this.shownProjects.indexOf(p) > -1){
      this.shownProjects.splice(this.shownProjects.indexOf(p), 1);
    }
  }

  public saveReport(): void{

  }

  public submitReport(): void{

  }

  public isShown(p: Project): boolean{
    return this.shownProjects.findIndex(it => {
      return it.id === p.id;
    }) != -1;
  }

}
