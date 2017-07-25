import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BreadcrumbService } from '../../services/breadcrumb.service';
import { UserService } from '../../services/user.service';

import { Project } from "../../models/project";
import { User } from "../../models/user";

import { ProjectDAL } from '../../dal/project.dal';
import { ReportDAL } from '../../dal/report.dal';
import { UserDAL } from '../../dal/user.dal';

import { CalendarHelper } from '../../helpers/calendar.helper';

import { ActivityReportComponent } from '../../widgets/activity-report';

@Component({
  providers: [ProjectDAL, ReportDAL, UserDAL],
  selector: 'app-report',
  styleUrls: ['./report.validation.component.css'],
  templateUrl: './report.validation.component.html'
})
export class ReportValidationComponent implements OnInit {
  protected currentUser: User = new User();
  protected user: User = null;
  protected users: Array<User> = new Array<User>();

  protected pendingReports: Array<any> = new Array<any>();
  protected pendingReportStatus: Object = new Object();

  protected reports: Array<any> = new Array<any>();
  protected reportStatus: Object = new Object();

  protected usersInput: Array<any> = new Array<any>();
  protected selectedUser: Array<any> = new Array<any>();

  protected reportMonth: Date = new Date();
  protected reportMonthDropdownOpen: boolean = false;

  protected status: string = '';
  protected valid: boolean = false;

  protected progress: number = 0;
  protected validationProgress: number = 0;
  protected userProgress: number = 0;

  constructor(
    private breadServ: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private reportDal: ReportDAL,
    private userDal: UserDAL,
    private userServ: UserService,
  ) {
    this.userServ.currentUser.subscribe((user: User) => {
      this.currentUser = user;

      this.userDal.readAll();
      this.userDal.users.subscribe((users) => {
        this.users = users;

        this.usersInput = new Array<any>();

        users.forEach(c => {
          this.usersInput.push({ 'id': c.id, 'text': c.getName() });
        })

        if (this.user)
          this.selectedUser = [{ 'id': this.user.id, 'text': this.user.getName() }];

        this.validationProgress = 1;
        this.reportDal.listPendingReports().first().subscribe(array => {
          this.pendingReportStatus = new Object();

          array.forEach(pr => {
            this.pendingReports.push({
              'user': pr.user,
              'month': pr.month,
              'monthStr': CalendarHelper.monthName(pr.month - 1),
              'year': pr.year,
            });

            this.reportDal.readStatus(this.getUser(pr.user), pr.year, pr.month - 1).first().subscribe(data => {
              this.setStatus(pr.month, pr.year, data["has_data"] ? data["status"] : "empty", data["valid"], pr.user);
            })
          });

          this.validationProgress = 0;
        });
      });
    });
  }

  public ngOnInit() {
    this.route.url.first().subscribe(url => {
      this.route.params.first().subscribe(params => {
        this.breadServ.set({
          header: 'Validation',
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
              link: ['/report', 'submit'],
              title: 'Compte rendu d\'activité'
            },
            {
              icon: 'flag',
              link: ['/report', 'history'],
              title: 'Validation'
            },
          ]
        });

        this.userProgress++;

        this.userDal.readById(+params['user']).then((user: User) => {
          this.user = user;
          if (!user) return;

          this.breadServ.push({ icon: 'user', link: ['/report', 'history', user.id], title: user.getName() });
          this.selectedUser = [{ 'id': this.user.id, 'text': this.user.getName() }];

          this.onUserSelected();

          this.navigate();
        });

        if (params['year'] && params['month']) {
          let date = new Date(+params['year'], +params['month'] - 1, 1);
          this.selectReportMonth(date);
        }
      });

    });
  }

  public selectUser(event: any) {
    if (!event || !event.id) return;
    this.selectedUser = [event];

    this.progress++;
    this.userProgress = 1;

    this.userDal.readById(event.id).then((user: User) => {
      this.user = user;
      this.breadServ.pop();
      this.breadServ.push({ icon: 'user', link: ['/report', 'validation', user.id], title: user.getName() });

      this.selectedUser = [{ 'id': this.user.id, 'text': this.user.getName() }];

      this.onUserSelected();

      this.navigate();

      this.progress--;
    });
  }

  public onUserSelected() {
    this.reportDal.listReports(this.user).toPromise().then(array => {
      this.reports = new Array<any>();
      this.reportStatus = new Object();

      array.forEach(r => {
        this.reports.push({
          'month': r.month,
          'monthStr': CalendarHelper.monthName(r.month - 1),
          'year': r.year,
        });

        this.reportDal.readStatus(this.user, r.year, r.month - 1).first().subscribe(data => {
          this.setStatus(r.month, r.year, data["has_data"] ? data["status"] : "empty", data["valid"], this.user.id);
        })
      })

      this.userProgress = 0;
    });
  }

  public selectReport(report: any) {
    this.selectReportMonth(new Date(report.year, report.month - 1, 1));
  }

  public selectPendingReport(report: any) {
    this.selectUser({'id': report.user});
    this.selectReport(report);
  }

  public toggleReportMonthDropdown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.reportMonthDropdownOpen = !this.reportMonthDropdownOpen;
  }

  public selectReportMonth(event: Date) {
    this.reportMonth = event;
    this.reportMonthDropdownOpen = false;
    this.navigate();
  }

  public reportMonthNext() {
    if (this.reportMonth.getMonth() == 11) {
      this.reportMonth = new Date(this.reportMonth.getFullYear() + 1, 0, 1);
    } else {
      this.reportMonth = new Date(this.reportMonth.getFullYear(), this.reportMonth.getMonth() + 1, 1);
    }
    this.reportMonthDropdownOpen = false;
    this.navigate();
  }

  public reportMonthPrevious() {
    if (this.reportMonth.getMonth() == 0) {
      this.reportMonth = new Date(this.reportMonth.getFullYear() - 1, 11, 1);
    } else {
      this.reportMonth = new Date(this.reportMonth.getFullYear(), this.reportMonth.getMonth() - 1, 1);
    }
    this.reportMonthDropdownOpen = false;
    this.navigate();
  }

  public readStatus() {
    this.status = 'empty';
    this.reportDal.readStatus(this.user, this.reportMonth.getFullYear(), this.reportMonth.getMonth()).first().subscribe(data => {
      this.status = data["has_data"] ? data["status"] : "empty";
      this.valid = data["valid"];

      this.setStatus(this.reportMonth.getMonth() + 1, this.reportMonth.getFullYear(), this.status, this.valid, this.user.id);
    });
  }

  public navigate() {
    if (!this.user) return;
    this.router.navigate(['/report', 'validation', this.user.id, this.reportMonth.getFullYear(), this.reportMonth.getMonth() + 1]);

    this.readStatus();
  }

  public goToHistory() {
    this.router.navigate(['/report', 'history', this.user.id, this.reportMonth.getFullYear(), this.reportMonth.getMonth() + 1]);
  }

  public getUser(id: number): User {
    let res = null;
    this.users.forEach(u => { if (u.id === id) res = u; });
    return res;
  }

  public setStatus(month: number, year: number, status: string, valid: boolean, user: number) {
      let m_y = month + '-' + year;

      if (user == this.user.id) {
        if (!this.reportStatus[m_y])
          this.reportStatus[m_y] = { 'status': 'empty', 'valid': false };

          this.reportStatus[m_y].status = status

          if (valid !== null) this.reportStatus[m_y].valid = valid;
      }

      if (!this.pendingReportStatus[user + '-' + m_y])
        this.pendingReportStatus[user + '-' + m_y] = { 'status': 'empty', 'valid': false };

      this.pendingReportStatus[user + '-' + m_y].status = status

      if (valid !== null) this.pendingReportStatus[user + '-' + m_y].valid = valid;
  }

  public toggleValidation(validated: boolean, report: any) {
    let user = report.user ? report.user : this.user.id;

    this.setStatus(report.month, report.year, validated ? 'validated' : 'submitted', null, user);

    if (!validated) {
      let found = false;
      this.pendingReports.forEach(pr => {
        if (pr.user == user && pr.year == report.year && pr.month == report.month) found = true;
      })

      if (!found) {
        this.pendingReports.push({
          'user': user,
          'month': report.month,
          'monthStr': CalendarHelper.monthName(report.month - 1),
          'year': report.year,
        })
      }
    }

    this.reportDal.saveValidation(this.getUser(user), report.year, report.month - 1, validated).first().toPromise()
    .catch(e => {
      this.reportDal.readStatus(this.getUser(user), report.year, report.month - 1).first().subscribe(data => {
        this.setStatus(report.month, report.year, data["has_data"] ? data["status"] : "empty", data["valid"], user);
      });
    })
    .then(() => {
      this.reportDal.readStatus(this.getUser(user), report.year, report.month - 1).first().subscribe(data => {
        this.setStatus(report.month, report.year, data["has_data"] ? data["status"] : "empty", data["valid"], user);
      });
    });
  }

}
