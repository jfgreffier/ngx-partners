import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { UserService } from './user.service';
import { AuthenticationService } from './authentication.service';
import { CanActivateGuard } from './guard.service'

@Injectable()
export class CanActivateAdminGuard extends CanActivateGuard {
  private admin: boolean = false;

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

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return Observable.combineLatest(this._user.currentUser, super.canActivate(route, state), (user, can) => {
      return can && user.isAdmin();
    });
  }
}
