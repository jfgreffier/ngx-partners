import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/user';

import { NotificationService } from '../services/notification.service';
import { RestService } from '../services/rest.service';

@Injectable()
export class UserDAL {
  private users: Observable<Array<User>>;

  constructor(private rest: RestService, private notif: NotificationService) { }

  public readAll = (): Observable<Array<User>> => {
    this.users = this.rest.getAll('users');
    return this.users;
  }

  public create = (newUser: User): Observable<Array<User>> => {
    return this.users = Observable.combineLatest(
      this.users,
      this.rest.add('users', newUser),
      (array, res) => {
        this.notif.success('L\'utilisateur a bien été créé.');
        let u: User = res;
        array.push(u);
        return array;
      }
    ).catch((err, res) => {
      this.notif.error('Erreur lors de la création : ' + err);
      return res;
    });
  }

}
