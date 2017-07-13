import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { AuthenticationService } from '../../services/authentication.service';

import { Configuration } from '../../app.constants';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {
  protected username: string;
  protected password: string;
  protected password_check: string;

  protected error: string;

  protected firstname: string;
  protected lastname: string;

  private token: string;

  protected progress: number = 0;

  constructor(
    private route: ActivatedRoute,
    private authentication: AuthenticationService,
  ) {
  }

  public ngOnInit() {
    window.dispatchEvent(new Event('resize'));

    this.route.params.subscribe(params => {
      this.token = params["token"];

      this.fetchUser();
    });
  }

  public register() {
    this.error = '';

    if (this.password == null || this.password_check == null || this.username == null) {
      this.error = 'fields';
      return;
    }
    if (this.password !== this.password_check) {
      this.error = 'credentials';
      return;
    }

    this.progress = 1;

    this.authentication.registrationConfirm(this.token, this.username, this.password).first().toPromise().then((r: Response) => {
      this.progress = 2;
    }).catch((r: Response) => {
      if (r.status == 200 || r.status == 201) {
        this.progress = 2;
      } else if (r.status == 400){
        this.progress = 0;
        this.error = 'username';
      } else {
        this.progress = 0;
        this.error = 'other';
      }
    });
  }

  public fetchUser() {
    this.authentication.getRegistrationInfo(this.token).first().toPromise().then((info: Object) => {
      if (!info['firstname'] || !info['lastname']) {
        this.error = 'token';
        return;
      }

      this.firstname = info['firstname'];
      this.lastname = info['lastname'];
    }).catch((r: Response) => {
      this.error = 'token';
      return;
    });
  }

}
