import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { User } from '../models/user';
import { Project } from '../models/project';

import { NotificationService } from '../services/notification.service';
import { RestService } from '../services/rest.service';

@Injectable()
export class UserDAL {
  public users: ReplaySubject<Array<User>> = new ReplaySubject<Array<User>>( 1 );

  constructor(
    private rest: RestService, 
    private notif: NotificationService
  ) { }

  public readAll = () => {
    this.rest.getAll('users').first().toPromise().then(users => {
      let array = new Array<User>();
      users.forEach(u => { array.push(new User(u)); });
      this.users.next(array);
    });
  }

  public readByActivity = (project: Project): Promise<Array<User>> => {
    return this.rest.getAll('users', 'by-activity/' + project.id).first().toPromise().then(users => {
      let array = new Array<User>();
      users.forEach(u => { array.push(new User(u)); });
      this.users.next(array);
      return array;
    });
  }

  public readById = (id: number): Promise<User> => {
    return this.rest.get('users', id).first().toPromise().then(data => {
      return new User(data['user']);
    });
  }

  public readMe = (): Promise<User> => {
    return this.rest.get('users/me').first().toPromise().then(data => {
      return new User(data['user']);
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

  public update = (user: User, self: boolean): Promise<any> => {
    return this.rest.update('users' + (self ? '/me' : ''), (self ? null : user.id), (self ? user.trimForUsers() : user)).first().toPromise().then((res) => {
      this.notif.success('Les informations ont bien été enregistrées.');
      let u: User = new User(res.user);

      this.users.first().subscribe(users => {
        users.forEach((u: User) => { if (u.id == user.id) u = user; });
        this.users.next(users);
      });
    }).catch((err) => {
      console.log(err);
      this.notif.error('Erreur lors de l\'enregistrement');
    });
  }

  public updatePassword = (user: User, password: string, self: boolean, password_createmailbox: boolean = false): Promise<any> => {
    return this.rest.update(
      'users/' + (self ? 'me' : user.id) + '/password', null,
      { 'password': password, 'linkmailbox': password_createmailbox ? 1 : 0 }
    ).first().toPromise().then((res) => {
      this.notif.success('Le mot de passe a bien été modifié.');
    }).catch((err) => {
      console.log(err);
      this.notif.error('Erreur lors de l\'enregistrement');
    });
  }

  public delete = (user: User): Promise<void> => {
    return this.rest.delete('users', user.id).toPromise().then(resp => {
      this.notif.success('L\'utilisateur' + user.getName() + ' a bien été supprimé.')

      this.users.first().subscribe(users => {
        let index = users.indexOf(user);
        if (index > -1) users.splice(index, 1);

        this.users.next(users);
      });
    }).catch((err) => {
      console.log(err);
      this.notif.error('Erreur lors de la suppression');
    });
  }

  public resendConfirmationMail = (user: User): Promise<any> => {
    return this.rest.add('users/' + user.id + '/registration/mail', {}).first().toPromise().then((res) => {
      this.notif.success('Le mail a bien été envoyé');
      let u: User = new User(res.user);

      this.users.first().subscribe(users => {
        users.push(u);
        this.users.next(users);
      });
    }).catch((err) => {
      console.log(err);
      this.notif.error('Erreur lors de l\'envoi du mail');
    });
  }

  public activate = (user: User): Promise<any> => {
    return this.rest.add('users/' + user.id + '/activate', {}).first().toPromise().then((res) => {
      this.notif.success('L\'utilisateur a bien été réactivé');
      this.users.first().subscribe(users => {
        let index = users.indexOf(user);
        if (index > -1) users[index].enabled = true;

        this.users.next(users);
      });
    }).catch((err) => {
      console.log(err);
      this.notif.error('Erreur lors de l\'activation');
    });
  }

  public deactivate = (user: User): Promise<any> => {
    return this.rest.add('users/' + user.id + '/deactivate', {}).first().toPromise().then((res) => {
      this.notif.success('L\'utilisateur a bien été désactivé');
      this.users.first().subscribe(users => {
        let index = users.indexOf(user);
        if (index > -1) users[index].enabled = false;

        this.users.next(users);
      });
    }).catch((err) => {
      console.log(err);
      this.notif.error('Erreur lors de la désactivation');
    });
  }
  
}
