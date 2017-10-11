import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  protected password: string;
  protected username: string;

  protected error: string;

  protected loginProgress: number = 0;

  private returnUrl: string;

  constructor(
    private userServ: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authentication: AuthenticationService,
  ) {
  }

  public ngOnInit() {
    window.dispatchEvent( new Event( 'resize' ) );

    this.route.url.first().subscribe(url => {
      if (url[0].toString() == 'logout') {
        this.userServ.logout();
        return;
      }

      if (this.authentication.loggedIn()) {
        this.loginProgress = 1;
        this.router.navigate(['/portal']);
      }
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/portal/home';
  }

  private login() {
    this.error = "";
    this.loginProgress = 1;

    this.authentication.authenticate(this.username, this.password)
      .first()
      .subscribe(
        data => {
          localStorage.setItem('token', data.token);
          let timeoutId = setTimeout(() => {  
            this.updateUser();
          }, 50);
          
          clearTimeout(timeoutId);
        },
        error => {
          this.loginProgress = 0;
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
          this.loginProgress = 0;
          this.router.navigateByUrl(this.returnUrl);
        },
        error => {
          this.loginProgress = 0;
          console.log(error);
          this.error = error._body;
          this.authentication.logout();
        }
      );
  }

  private forgotPwd() {
    this.router.navigate(['/forgotPassword']);
  }

}
