import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { User } from '../models/user';
import { Project } from '../models/project';

import { NotificationService } from '../services/notification.service';
import { RestService } from '../services/rest.service';

@Injectable()
export class UserDAL {
  public users: ReplaySubject<Array<User>> = new ReplaySubject<Array<User>>( 1 );

  constructor(private rest: RestService, private notif: NotificationService) { }

  public readAll = () => {
    this.rest.getAll('users').first().toPromise().then(users => {
      let array = new Array<User>();
      users.forEach(u => { array.push(new User(u)); });
      this.users.next(array);
    });
  }

  public readByActivity = (project: Project): Promise<Array<User>> => {
    return this.rest.getAll('users', '/by-activity/' + project.id).first().toPromise().then(users => {
      let array = new Array<User>();
      users.forEach(u => { array.push(new User(u)); });
      this.users.next(array);
      return users;
    });
  }

  public create = (newUser: User): Promise<any> => {
    return this.rest.add('users', newUser).first().toPromise().then((res) => {
      this.notif.success('L\'utilisateur a bien été créé.');
      let u: User = new User(res.user);

      this.users.first().subscribe(users => {
        users.push(u);
        this.users.next(users);
      });
    }).catch((err) => {
      console.log(err);
      this.notif.error('Erreur lors de la création, l\'email n\'est pas unique');
    });
  }

}
