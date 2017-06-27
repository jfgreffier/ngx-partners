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
  private projects: Observable<Array<Project>>;
  private shownProjects: Array<Project>;
  private days: Array<Day>;

  private currentMonth: Date;
  private currentMonthName: string;

  constructor(
    private breadServ: BreadcrumbService,
    private projectDal: ProjectDAL,
  ) {
  }

  public ngOnInit() {
    this.days = new Array<Day>();
    this.shownProjects = new Array<Project>();

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

    this.projects = this.projectDal.readAll();

    this.currentMonthName = CalendarHelper.monthName(this.currentMonth) + " " + this.currentMonth.getFullYear();

    this.projects.subscribe((parray) => {
      parray.forEach(p => {
        if (true){ // if we have reports on this projects
          this.shownProjects.push(p);
        }
      })
    });

    for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++){
      let d = new Day;
      d.day = i;
      d.working = !(i % 7 == 3 || i % 7 == 4);
      this.days.push(d);
    }
  }

  public addProject(): void{

  }

  public removeProject(p: Project): void{
    if (this.shownProjects.indexOf(p) > -1){
      this.shownProjects.splice(this.shownProjects.indexOf(p), 1);
    }
  }

  public submitReport(): void{

  }

}
