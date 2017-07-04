import { User } from '../models/user';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { AuthenticationService } from '../services/authentication.service';

import { Configuration } from '../app.constants';

@Injectable()
export class UserService {
    public currentUser: ReplaySubject<User> = new ReplaySubject<User>( 1 );

    constructor(
      private router: Router,
      private http: AuthHttp,
      private authentication: AuthenticationService,
      private config: Configuration,
    ) {
      if (authentication.loggedIn()){
        this.fetchUser();
      }
    }

    public setCurrentUser( user: User ) {
      this.currentUser.next( user );
    }

    public logout() {
      this.authentication.logout();

      let user = new User();
      user.connected = false;
      this.setCurrentUser( user );
      this.router.navigate(['login']);
    }

    public fetchUser() {
      let url = this.config.serverWithApiUrl + 'users/me';

      let req = this.http.get(url)
        .map((data: Response) => data.json())
        .map((data) => {
          return new User(data.user);
        });

      req.subscribe(user => {
        user.connected = true;
        this.setCurrentUser(user);
      });

      return req;
    }
}
