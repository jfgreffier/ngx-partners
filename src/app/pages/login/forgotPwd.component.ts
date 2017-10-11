import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

import { UserDAL } from '../../dal/user.dal';

@Component({
  providers: [UserDAL],
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
    private userDal: UserDAL
  ) {
  }

  private getNewPassword() {
    this.userDal.getNewPassword(this.username).then((res) => {
        console.log('Réinitialisation du mot de passe réussie.')
    }).catch((err) => {
        console.log(err);
    });
  }
}