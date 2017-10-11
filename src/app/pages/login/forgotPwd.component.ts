import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-forgotPwd',
  templateUrl: './forgotPwd.component.html'
})
export class ForgotPwdComponent {
  protected username: string;

  protected error: string;

  private returnUrl: string;

  constructor(
    private userServ: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authentication: AuthenticationService
  ) {
  }

  private getNewPassword() {
      
  }
}