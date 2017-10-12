import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-forgotPwd',
  templateUrl: './forgotPwd.component.html'
})
export class ForgotPwdComponent implements OnInit {
  protected username: string;

  protected error: string;

  private returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authentication: AuthenticationService
  ) {
  }
  
    public ngOnInit() {
      window.dispatchEvent(new Event('resize'));
    }

  private getNewPassword() {
    this.authentication.forgotPassword(this.username)
    .first()
    .subscribe(
      data => {
        console.log('Réinitialisation du mot de passe réussie.');
      },
      error => {
        console.log(error);
      }
    );
  }
}