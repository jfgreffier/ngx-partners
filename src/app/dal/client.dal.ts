import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { Client } from '../models/client';

import { RestService } from '../services/rest.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ClientDAL {
  public clients: ReplaySubject<Array<Client>> = new ReplaySubject<Array<Client>>( 1 );

  constructor(private rest: RestService, private notif: NotificationService) { }

  public readAll = () => {
    this.rest.getAll('clients').toPromise().then(clients => {
      let array = new Array<Client>();
      clients.forEach(c => { array.push(new Client(c)); });
      this.clients.next(array);
    });
  }
}
