import { Component, OnInit, Input, Output, EventEmitter, ApplicationRef } from '@angular/core';

import { Report } from '../../models/report';
import { Project } from '../../models/project';

import { ReportDAL } from '../../dal/report.dal';
import { ProjectDAL } from '../../dal/project.dal';

import { CalendarHelper } from '../../helpers/calendar.helper';

class Day {
  public day: number;
  public working: boolean;
}

@Component({
  selector: 'activity-report',
  styleUrls: ['./activity-report.component.css'],
  templateUrl: './activity-report.component.html'
})
export class ActivityReportComponent implements OnInit {

  public shownProjects: Array<Project> = new Array<Project>();
  protected shownActivities: Array<Project> = new Array<Project>();
  protected days: Array<Day> = new Array<Day>();

  protected values: Object = new Object(); // [project.id][day.id] = float [0..1]
  @Output('values') private valuesChange: EventEmitter<Object> = new EventEmitter();

  protected _currentMonth: Date;

  @Input() protected set currentMonth(value: Date) {
    this.reportProgress++;
    this._currentMonth = value;
    this.readActivities().then(() => {
      this.selectMonth();
      this.reportProgress--;
    });
  }
  protected get currentMonth(): Date { return this._currentMonth; }

  protected currentMonthName: string;

  protected dayError: Object = new Object(); // [day.id][project.id]

  protected reportProgress: number = 0;

  constructor(
    private app: ApplicationRef,
    private reportDal: ReportDAL,
    private projectDal: ProjectDAL,
  ) {

  }

  public ngOnInit() {

  }

  public readActivities(): Promise<void> {
    this.reportProgress++;

    return this.reportDal.readInfo().then((info: Object) => {
      this.shownActivities = info["activities"];

      this.shownActivities.forEach(a => {
        this.values[a.id] = new Array<number>(CalendarHelper.daysInMonth(this.currentMonth));

        for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++)
          this.values[a.id][i] = 0;
      });

      this.reportProgress--;

    });
  }

  public selectMonth(): void{
    this.reportProgress++;

    this.currentMonthName = CalendarHelper.monthName(this.currentMonth) + " " + this.currentMonth.getFullYear();

    this.projectDal.readAll();

    this.projectDal.projects.first().subscribe(parray => {
      let usedProject = Object();

      this.dayError = new Array<boolean>(CalendarHelper.daysInMonth(this.currentMonth));

      parray.forEach(p => {
        this.values[p.id] = new Array<number>(CalendarHelper.daysInMonth(this.currentMonth));

        for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++){
          this.values[p.id][i] = 0;
          usedProject[p.id] = false;
        }
      });

      let serverSideReport = this.reportDal.readMonth(this.currentMonth.getFullYear(), this.currentMonth.getMonth());

      serverSideReport.first().subscribe((reports: Array<Report>) => {

        reports.forEach((report: Report) => {
          this.values[report.activity][report.date.getDate()] = report.duration;
          usedProject[report.activity] = true;
        });

        this.valuesChange.emit(this.values);

        this.shownProjects = new Array<Project>();

        parray.forEach(p => {
          if (usedProject[p.id])
            this.shownProjects.push(p);
        });

        for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++)
          this.checkValidity(i);

        this.reportProgress--;
      });
    });

    this.days = new Array<Day>();

    for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++){
      let d = new Day;
      d.day = i;
      d.working = CalendarHelper.isWorkingDay(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i));
      this.days.push(d);
    }
  }

  public removeProject(p: Project): void{
    if (this.shownProjects.indexOf(p) > -1){

      for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++){
        this.values[p.id][i] = 0;
        this.checkValidity(i);
      }

      this.shownProjects.splice(this.shownProjects.indexOf(p), 1);

    }
  }

  public onInputChanged(event: string, project: Project, day: Day): void{
    let value: number = parseFloat(event);
    if (isNaN(value)) value = this.values[project.id][day.day];

    this.values[project.id][day.day] = value;

    this.valuesChange.emit(this.values);
  }

  public addProject(project: Project) {
    this.shownProjects.push(project);
  }

  public checkInput(event: any, project: Project, day: Day): void{
    if (isNaN(parseFloat(event.target.value)) || event.target.value == ""){
      // force input revaluation
      if (event.target.value == "") this.values[project.id][day.day] = 0;
      let value: number = parseFloat(this.values[project.id][day.day]) || 0;
      this.values[project.id][day.day] = -1;
      this.app.tick();
      this.values[project.id][day.day] = value;
      this.valuesChange.emit(this.values);
    }

    if (this.values[project.id][day.day] > 1) {
      this.values[project.id][day.day] = 1;
      this.valuesChange.emit(this.values);
    }

    if (this.values[project.id][day.day] < 0) {
      this.values[project.id][day.day] = 0;
      this.valuesChange.emit(this.values);
    }

    this.checkValidity(day.day);
  }

  public checkValidity(day: number){
    let sum: number = 0;
    Object.keys(this.values).forEach(it => {
      sum += this.values[it][day];
    });

    this.dayError[day] = sum > 1;
  }

}
