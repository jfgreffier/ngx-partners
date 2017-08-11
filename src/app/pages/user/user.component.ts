import { Component, OnInit, OnDestroy } from '@angular/core';

import { BreadcrumbService } from '../../services/breadcrumb.service';
import { UserService } from '../../services/user.service';

import { User } from "../../models/user";

import { UserDAL } from '../../dal/user.dal';

@Component({
  providers: [UserDAL],
  selector: 'app-user',
  styleUrls: ['./user.component.css'],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  protected users: Array<User>;

  protected newUser: User;

  protected usersProgress: number = 0;
  protected userFormProgress: number = 0;

  constructor(
    private breadServ: BreadcrumbService,
    private userDal: UserDAL,
  ) {
  }

  public ngOnInit() {
    this.usersProgress = 1;

    this.userDal.readAll();

    this.userDal.users.subscribe((clients) => {
      this.users = clients;
      this.usersProgress = 0;
    });

    this.newUser = new User(({generateProEmail: true}));

    this.breadServ.set({
      header: 'Utilisateurs',
      display: true,
      levels: [
        {
          icon: 'dashboard',
          link: ['/portal'],
          title: 'Home'
        },
        {
          icon: 'users',
          link: ['/portal', 'users'],
          title: 'Utilisateurs'
        }
      ]
    });
  }

  public addUser(){
    this.userFormProgress = 1;
    this.userDal.create(this.newUser).then(() => {
      this.userFormProgress = 0;
    }).catch(() => {
      this.userFormProgress = 0;
    });
  }

  public deleteUser(user: User) {
    this.usersProgress = 1;
    this.userDal.delete(user).then(() => {
      this.usersProgress = 0;
    }).catch(() => {
      this.usersProgress = 0;
    });
  }

  public activateUser(user: User) {
    this.usersProgress = 1;
    this.userDal.activate(user).then(() => {
      this.usersProgress = 0;
    }).catch(() => {
      this.usersProgress = 0;
    });
  }

  public deactivateUser(user: User) {
    this.usersProgress = 1;
    this.userDal.deactivate(user).then(() => {
      this.usersProgress = 0;
    }).catch(() => {
      this.usersProgress = 0;
    });
  }
}
