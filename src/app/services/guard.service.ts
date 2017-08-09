import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class CanActivateGuard implements CanActivate {
  private connected: boolean = false;

  constructor(
    private router: Router,
    private user: UserService,
    private authentication: AuthenticationService
  ) {
    this.user.currentUser.subscribe((user) => {
      this.connected = user.connected;
    });
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // test here if you user is logged
    if (!this.authentication.loggedIn()){
      this.router.navigate( [ '/login' ], { queryParams: { returnUrl: state.url }} );
    }

    return this.authentication.loggedIn();
  }
}
