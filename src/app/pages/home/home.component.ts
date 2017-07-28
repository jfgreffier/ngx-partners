import { Component, OnInit, OnDestroy } from '@angular/core';

import { BreadcrumbService } from '../../services/breadcrumb.service';
import { UserService } from '../../services/user.service';

import { User } from '../../models/user';

import { ReportDAL } from '../../dal/report.dal';

import { CalendarHelper } from '../../helpers/calendar.helper';

@Component({
  providers: [ReportDAL],
  selector: 'app-home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  protected currentUser: User = new User();

  protected reportMonth: string;
  protected reportYear: number;

  constructor(
    private userServ: UserService,
    private breadServ: BreadcrumbService,
    private reportDal: ReportDAL,
  ) {
    this.userServ.currentUser.subscribe((user: User) => this.currentUser = user);

    this.reportDal.readInfo().then((info: Object) => {
      let month: Date = new Date(info["currentMonth"]);
      this.reportMonth = CalendarHelper.monthName(month);
      this.reportYear = month.getFullYear();
    });
  }

  public ngOnInit() {
    // setttings the header for the home
    this.breadServ.set({
      description: '',
      display: true,
      header: 'Dashboard',
      levels: [
        {
          icon: 'dashboard',
          link: ['/portal'],
          title: 'Home'
        }
      ]
    });
  }

  public ngOnDestroy() {
    // removing the header
    this.breadServ.clear();
  }

}
