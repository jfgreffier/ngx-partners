import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { NotificationService } from '../../services/notification.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

import { User } from '../../models/user';

import { UserDAL } from '../../dal/user.dal';

@Component({
  providers: [UserDAL],
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  protected user: User = null;

  protected profileProgress: number = 0;

  protected password: string;
  protected password_check: string;

  constructor(
    private route: ActivatedRoute,
    private breadServ: BreadcrumbService,
    private userDal: UserDAL,
    private notif: NotificationService,
  ) {
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

    this.route.params.subscribe(params => {
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

    });
  }

  public saveUser() {
    this.profileProgress = 1;

    this.userDal.update(this.user).then(() => {
      this.profileProgress = 0;
    });
  }

  public updatePassword() {
    if (this.password == "" || this.password !== this.password_check) {
      this.notif.error('Les mots de passes ne correspondent pas');
      return;
    }

    this.profileProgress = 1;

    this.userDal.updatePassword(this.user, this.password).then(() => {
      this.profileProgress = 0;
    });

    this.password = "";
    this.password_check = "";
  }

}
