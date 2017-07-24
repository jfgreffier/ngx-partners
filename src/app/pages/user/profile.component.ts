import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { NotificationService } from '../../services/notification.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { UserService } from '../../services/user.service';

import { User } from '../../models/user';

import { UserDAL } from '../../dal/user.dal';
import { ProjectDAL } from '../../dal/project.dal';
import { ReportDAL } from '../../dal/report.dal';

@Component({
  providers: [UserDAL, ProjectDAL, ReportDAL],
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  protected user: User = null;

  protected currentUser: User = new User();
  protected currentUserCurrentMonth: Date = new Date();

  protected profileProgress: number = 0;

  protected password: string;
  protected password_check: string;

  private self: boolean = false;

  protected reportMonth: Date = new Date();
  protected reportMonthDropdownOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breadServ: BreadcrumbService,
    private userDal: UserDAL,
    private reportDal: ReportDAL,
    private notif: NotificationService,
    private userServ: UserService,
  ) {
    this.userServ.currentUser.subscribe((user: User) => this.currentUser = user );
  }

  public ngOnInit() {

    this.breadServ.set({
      header: 'Utilisateur',
      display: true,
      levels: [
        { icon: 'dashboard', link: ['/'], title: 'Home' },
        { icon: 'users', link: ['/users'], title: 'Utilisateurs' }
      ]
    });

    this.route.url.subscribe(url => {
      this.route.params.subscribe(params => {
        if (url[0].toString() == 'users' && url[1].toString() == 'me'){
          this.userDal.readMe().then((user: User) => {
            this.user = user;
            this.self = true;

            this.breadServ.set({
              header: user.getName(),
              display: true,
              levels: [
                { icon: 'dashboard', link: ['/'], title: 'Home' },
                { icon: 'user', link: ['/users', 'me'], title: 'Mon Profil' }
              ]
            });
          });
        }else{
          this.userDal.readById(+params['id']).then((user: User) => {
            this.user = user;

            this.breadServ.set({
              header: user.getName(),
              display: true,
              levels: [
                { icon: 'dashboard', link: ['/'], title: 'Home' },
                { icon: 'users', link: ['/users'], title: 'Utilisateurs' },
                { icon: 'user', link: ['/users', user.id], title: user.getName() }
              ]
            });
          });
        }
      });

    });

    this.reportDal.readInfo().then((info: Object) => {
      this.currentUserCurrentMonth = new Date(info["currentMonth"]);
    });
  }

  public saveUser() {
    this.profileProgress = 1;

    this.userDal.update(this.user, this.self).then(() => {
      this.profileProgress = 0;
    });
  }

  public updatePassword() {
    if (this.password == "" || this.password !== this.password_check) {
      this.notif.error('Les mots de passes ne correspondent pas');
      return;
    }

    this.profileProgress = 1;

    this.userDal.updatePassword(this.user, this.password, this.self).then(() => {
      this.profileProgress = 0;
    });

    this.password = "";
    this.password_check = "";
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

  public canAccessSubmit(): boolean {
    if (!this.user || this.currentUser.id !== this.user.id) return false;
    return this.reportMonth.getFullYear() == this.currentUserCurrentMonth.getFullYear() && this.reportMonth.getMonth() == this.currentUserCurrentMonth.getMonth();
  }

  public goToDetails() {
    let u = this.user.id === this.currentUser.id ? 'me' : ''+this.user.id;
    this.router.navigate(['/report', 'history', u, this.reportMonth.getFullYear(), this.reportMonth.getMonth() + 1]);
  }

  public resendConfirmationMail() {
    this.profileProgress = 1;

    this.userDal.resendConfirmationMail(this.user).then(() => {
      this.profileProgress = 0;
    });
  }

}
