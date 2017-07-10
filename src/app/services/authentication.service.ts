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
    private config: Configuration,
  ) {
  }

  authenticate(username: string, password: string) {
    let url = this.config.serverWithApiUrl + 'login_check';
    let body 	= new URLSearchParams();
    body.append('username', username);
    body.append('password', password);
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});

  	return this.http.post(url, body.toString(), options)
  		.map((data: Response) => data.json());
  }

  logout() {
    localStorage.removeItem('token');
  }

  loggedIn() {
    return tokenNotExpired();
  }
}