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

  private users: Promise<Array<User>>;

  private newUser: User;

  constructor(
    private breadServ: BreadcrumbService,
    private userDal: UserDAL,
  ) {
  }

  public ngOnInit() {
    this.users = this.userDal.readAll().toPromise();

    this.newUser = new User();

    this.breadServ.set({
      header: 'Utilisateurs',
      display: true,
      levels: [
        {
          icon: 'dashboard',
          link: ['/'],
          title: 'Home'
        },
        {
          icon: 'users',
          link: ['/users'],
          title: 'Utilisateurs'
        }
      ]
    });
  }

  public addUser(){
    this.users = this.userDal.create(this.newUser).toPromise();
  }

}
