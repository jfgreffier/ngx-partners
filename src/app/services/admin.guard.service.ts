import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { AuthenticationService } from './authentication.service';
import { CanActivateGuard } from './guard.service'

@Injectable()
export class CanActivateAdminGuard extends CanActivateGuard {
  private admin: boolean = true;

  constructor(
    private _router: Router,
    private _user: UserService,
    private _authentication: AuthenticationService
  ) {
    super(_router, _user, _authentication);
    this._user.currentUser.subscribe((user) => {
      this.admin = user.isAdmin();
    });
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return super.canActivate(route, state) && this.admin;
  }
}
