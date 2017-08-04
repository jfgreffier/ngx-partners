import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';

import { Report } from '../../models/report';
import { Project } from '../../models/project';
import { User } from '../../models/user';

import { ReportDAL } from '../../dal/report.dal';
import { UserDAL } from '../../dal/user.dal';

import { CalendarHelper } from '../../helpers/calendar.helper';

class Day {
  public day: number;
  public working: boolean;
  public shortName: string;
}

@Component({
  selector: 'project-report',
  styleUrls: ['./project-report.component.css'],
  templateUrl: './project-report.component.html'
})
export class ProjectReportComponent implements OnChanges {

  @Input('project') protected reportProject: Project = null;

  @Input() protected currentMonth: Date;
  protected currentMonthName: string;

  private users: Array<User> = []
  protected shownUsers: Array<User> = [];

  protected days: Array<Day> = new Array<Day>();
  protected dayError: Object = new Object(); // [day.id][project.id]

  protected values: Object = new Object(); // [user.id][day.id] = float [0..1]

  protected rowSum: Array<number> = new Array<number>(); // [project.id]

  protected reportProgress: number = 0;

  constructor(
    private reportDal: ReportDAL,
    private userDal: UserDAL,
  ) {

  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['reportProject'] && changes['reportProject'].currentValue.id) {
      this.reportProgress++;
      this.userDal.readByActivity(this.reportProject).then(users => {
        this.users = users;
        this.selectMonth();
        this.reportProgress--;
      });
    } else if (this.reportProject && this.reportProject.id)
      this.selectMonth();
  }

  public selectMonth(): void {
    this.currentMonthName = CalendarHelper.monthName(this.currentMonth);

    this.dayError = new Array<boolean>(CalendarHelper.daysInMonth(this.currentMonth));

    this.users.forEach(u => {
      this.values[u.id] = new Array<number>(CalendarHelper.daysInMonth(this.currentMonth));

      for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++) {
        this.values[u.id][i] = 0;
      }
    });

    this.rowSum = new Array<number>();
    this.shownUsers = new Array<User>();

    this.users.forEach(user => {
      this.reportProgress++;

      let serverSideReport = this.reportDal.readMonth(user, this.currentMonth.getFullYear(), this.currentMonth.getMonth());
      serverSideReport.first().subscribe((reports: Array<Report>) => {

        let found = false;

        reports.forEach((report: Report) => {
          if (report.activity != this.reportProject.id) return;

          this.values[user.id][report.date.getDate()] = report.duration;
          this.rowSum[user.id] = this.rowSum[user.id] ? this.rowSum[user.id] + report.duration : report.duration;
          found = true;
        });

        if (found)
          this.shownUsers.push(user);

        for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++)
          this.checkValidity(i);

        this.reportProgress--;
      });

    });

    this.days = new Array<Day>();

    for (let i = 1; i <= CalendarHelper.daysInMonth(this.currentMonth); i++) {
      let d = new Day;
      d.day = i;
      d.working = CalendarHelper.isWorkingDay(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i));
      d.shortName = CalendarHelper.dayShortName(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i));
      this.days.push(d);
    }
  }

  public checkValidity(day: number) {
    let sum: number = 0;
    Object.keys(this.values).forEach(it => {
      sum += this.values[it][day];
    });

    this.dayError[day] = sum > 1;
  }

}
