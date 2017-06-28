import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
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
  styleUrls: ['./report.component.css'],
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

  private activities: Array<string>;
  private projects: Promise<Array<Project>>;
  private shownProjects: Array<Project>;
  private days: Array<Day>;

  private values: Object; // [project.id][day.id] = float [0..1]

  private currentMonth: Date;
  private currentMonthName: string;

  // used by add-project dialog
  private selectedProjectId: number = -1;

  private dayError: Array<boolean>; // [day.id][project.id] = { -1: invalid, 0: empty, 1: valid}

  constructor(
    private breadServ: BreadcrumbService,
    private projectDal: ProjectDAL,
    private app: ApplicationRef,
  ) {
  }

  public ngOnInit() {
    this.days = new Array<Day>();
    this.shownProjects = new Array<Project>();
    this.projects = Observable.of(new Array<Project>()).toPromise();

    this.activities = new Array("Geeking Days", "Formation", "CP", "Maladie", "Abs. exceptionnelle", "Congé sans solde");

    this.values = new Object();
    this.dayError = new Array<boolean>();

    this.selectMonth(new Date());

    this.breadServ.set({
      header: 'Compte rendu d\'activité',
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
    this.currentMonthName = CalendarHelper.monthName(this.currentMonth) + " " + this.currentMonth.getFullYear();

    this.projects = this.projectDal.readAll().toPromise();

    this.dayError = new Array<boolean>(CalendarHelper.daysInMonth(this.currentMonth));

    this.projects.then((parray) => {
      parray.forEach(p => {
        if (true){ // if we have reports on this projects
          this.shownProjects.push(p);

          this.values[p.id] = new Array<number>(CalendarHelper.daysInMonth(this.currentMonth));

          for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++)
            this.values[p.id][i] = 0;
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

      for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++){
        this.values[p.id][i] = 0
        this.checkValidity(i);
      }

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

  public onInputChanged(event, project: Project, day: Day): void{
    let value: number = event * 1.0;
    value = value || this.values[project.id][day.day];

    this.values[project.id][day.day] = value;
  }

  public checkInput(event, project: Project, day: Day): void{
    if (isNaN(event.target.value * 1.0) || event.target.value == ""){
      // force input revaluation
      if (event.target.value == "") this.values[project.id][day.day] = 0;
      let value: number = this.values[project.id][day.day] * 1.0 || 0;
      this.values[project.id][day.day] = -1;
      this.app.tick();
      this.values[project.id][day.day] = value;
    }

    if (this.values[project.id][day.day] > 1) this.values[project.id][day.day] = 1;
    if (this.values[project.id][day.day] < 0) this.values[project.id][day.day] = 0;

    this.checkValidity(day.day);
  }

  public checkValidity(day: number){
    this.projects.then(projects => {
      let sum: number = 0;

      projects.forEach(it => {
        sum += this.values[it.id][day];
      });

      this.dayError[day] = sum > 1;
    });
  }

}
