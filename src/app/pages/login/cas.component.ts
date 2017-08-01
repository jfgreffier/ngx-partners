import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { User } from '../../models/user';

import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

import { Configuration } from '../../app.constants';

@Component({
  selector: 'app-cas',
  templateUrl: './cas.component.html'
})
export class CASComponent implements OnInit {
  protected password: string;
  protected username: string;

  protected appName: string;

  protected redirect: boolean = false;
  protected acu: string = '';
  protected relayState: string = '';
  protected response: string = '';

  protected error: string;

  protected loginProgress: number = 0;

  private token: string;

  constructor(
    private userServ: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private config: Configuration,
    private http: Http,
    private authHttp: AuthHttp,
    private authentication: AuthenticationService,
  ) {
  }

  public ngOnInit() {
    window.dispatchEvent(new Event('resize'));

    this.loginProgress = 1;
    this.appName = 'NextCloud SlickTeam';

    this.route.params.subscribe(params => {
      this.token = params["token"];

      if (this.token == null) {
        this.error = "saml";
        this.userServ.logout(true);
      }

      if (this.authentication.loggedIn()) {
        this.saml();
      } else {
        this.loginProgress = 0;
      }
    });
  }

  private login() {
    this.error = "";
    this.loginProgress = 1;

    this.authentication.authenticate(this.username, this.password)
      .first()
      .subscribe(
      data => {
        localStorage.setItem('token', data.token);
        this.updateUser();
        this.saml();
      },
      error => {
        this.loginProgress = 0;
        if (error.status == 401) { // Unauthorized
          this.error = "credentials";
        } else {
          this.error = error._body;
        }
        console.log(error);
        this.userServ.logout(true);
      });
  }

  private saml() {
    let url = this.config.serverWithApiUrl + 'saml/response';
    let body = new URLSearchParams();
    body.append('token', this.token);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    this.authHttp.post(url, body.toString(), options)
      .map((data: Response) => data.json())
      .first()
      .subscribe(data => {
        this.acu = data['acu'];
        this.relayState = data['relayState'];
        this.response = data['response'];
        this.redirect = true;
      },
      error => {
        this.loginProgress = 0;
        this.error = "saml";
        this.userServ.logout(true);
      });
  }

  private updateUser(){
    this.userServ.fetchUser().first().subscribe(
        user => {
          console.log(user.getName() + " logged in!");
        },
        error => {
          this.loginProgress = 0;
          console.log(error);
          this.error = error._body;
          this.authentication.logout();
        }
      );
  }

}
