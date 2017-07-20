import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./report.history.component.css'],
  templateUrl: './report.history.component.html'
})
export class ReportHistoryComponent implements OnInit {
  protected currentUser: User = new User();
  protected user: User = null;
  protected users: Array<User> = new Array<User>();

  protected values: Object = new Object(); // [project.id][day.id] = float [0..1]

  protected usersInput: Array<any> = new Array<any>();
  protected selectedUser: Array<any> = new Array<any>();

  protected reportMonth: Date = new Date();
  protected reportMonthDropdownOpen: boolean = false;

  protected status: string = '';
  protected valid: boolean = false;

  protected progress: number = 0;

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

      if (user.isAdmin()) {
        this.userDal.readAll();
        this.userDal.users.subscribe((users) => {
          this.users = users;

          this.usersInput = new Array<any>();

          users.forEach(c => {
            this.usersInput.push({ 'id': c.id, 'text': c.getName() });
          })

          if (this.user)
            this.selectedUser = [{ 'id': this.user.id, 'text': this.user.getName() }];
        });
      }
    });
  }

  public ngOnInit() {
    this.route.url.first().subscribe(url => {
      this.route.params.first().subscribe(params => {
        this.breadServ.set({
          header: 'Historique',
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
              icon: 'history',
              link: ['/report', 'history'],
              title: 'Historique'
            },
          ]
        });

        this.progress++;

        if (params['user'] == 'me') {
          this.userDal.readMe().then((user: User) => {
            this.user = user;
            if (!user) return;

            this.breadServ.push({ icon: 'user', link: ['/report', 'history', 'me'], title: user.getName() });
            this.selectedUser = [{ 'id': this.user.id, 'text': this.user.getName() }];

            this.navigate();
          });
        } else {
          this.userDal.readById(+params['user']).then((user: User) => {
            this.user = user;
            if (!user) return;

            this.breadServ.push({ icon: 'user', link: ['/report', 'history', user.id], title: user.getName() });
            this.selectedUser = [{ 'id': this.user.id, 'text': this.user.getName() }];

            this.navigate();
          });
        }

        if (params['year'] && params['month']) {
          let date = new Date(+params['year'], +params['month'] - 1, 1);
          this.selectReportMonth(date);
        }

        this.progress = 0;

      });

    });
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

  public navigate() {
    let u = this.user ? (this.user.id === this.currentUser.id ? 'me' : '' + this.user.id) : 'me';
    this.router.navigate(['/report', 'history', u, this.reportMonth.getFullYear(), this.reportMonth.getMonth() + 1]);

    this.readStatus();
  }

  public saveReport() {
    this.progress = 1;

    let user = this.user ? (this.user.id === this.currentUser.id ? null : this.user) : null;

    this.reportDal.saveReport(this.reportMonth.getFullYear(), this.reportMonth.getMonth(), this.values, user)
      .then(() => this.progress = 0)
      .catch(() => this.progress = 0);
  }

  public selectUser(event: any) {
    if (!event || !event.id) return;
    this.selectedUser = [event];

    this.progress++;

    this.userDal.readById(event.id).then((user: User) => {
      this.user = user;
      this.breadServ.pop();
      this.breadServ.push({ icon: 'user', link: ['/report', 'history', user.id], title: user.getName() });

      this.navigate();

      this.progress--;
    });
  }

  public readStatus() {
    this.status = 'empty';
    this.reportDal.readStatus(this.user ? (this.user.id === this.currentUser.id ? null : this.user) : null, this.reportMonth.getFullYear(), this.reportMonth.getMonth()).first().subscribe(data => {
      this.status = data["has_data"] ? data["status"] : "empty";
      this.valid = data["valid"];
    })
  }

  public onValuesChanges(event: Object) {
    this.values = event;
  }

}
