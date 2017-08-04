import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

import 'rxjs/add/operator/map';

import { Configuration } from '../app.constants';

@Injectable()
export class AuthenticationService {

  constructor(
    private http: Http,
    private router: Router,
  ) {
  }

  authenticate(username: string, password: string) {
    let url = Configuration.serverWithApiUrl + 'login_check';
    let body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body.toString(), options)
      .map((data: Response) => data.json());
  }

  getRegistrationInfo(token: string) {
    let url = Configuration.serverWithApiUrl + 'registration/' + token;

    return this.http.get(url)
      .map((data: Response) => data.json())
      .map((data: Object) => data['user']);
  }

  registrationConfirm(token: string, username: string, password: string) {
    let url = Configuration.serverWithApiUrl + 'registration/' + token;

    let body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body.toString(), options);
  }

  logout() {
    localStorage.removeItem('token');
  }

  loggedIn() {
    return tokenNotExpired();
  }
}