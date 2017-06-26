import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private password: string;
  private username: string;

  protected error: string;

  constructor(
    private userServ: UserService,
    private router: Router,
    private authentication: AuthenticationService,
  ) {
  }

  public ngOnInit() {
    window.dispatchEvent( new Event( 'resize' ) );
  }

  private login() {
    this.error = "";

    this.authentication.authenticate(this.username, this.password)
      .subscribe(
        data => {
          localStorage.setItem('id_token', data.token);
          this.updateUser();
        },
        error => {
          if (error.status == 401){ // Unauthorized
              this.error = "credentials";
          }else{
              this.error = error._body;
          }
          console.log(error);
          this.userServ.logout();
        }
      );
  }

  private updateUser(){
    this.userServ.fetchUser().subscribe(
        user => {
          console.log(user.getName() + " logged in!");

          this.router.navigate(['home']);
        },
        error => {
          console.log(error);
          this.error = error._body;
          this.authentication.logout();
        }
      );
  }

}
