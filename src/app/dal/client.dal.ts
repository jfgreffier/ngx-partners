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

  public create = (newClient: Client): Promise<Client> => {
    return this.rest.add('clients', newClient).first().toPromise().then((res) => {
      this.notif.success('Le client "' + newClient.name + '" a bien été créé.');
      let c: Client = new Client(res.client);

      this.clients.first().subscribe(clients => {
        clients.push(c);
        this.clients.next(clients);
      });

      return c;
    }).catch((err) => {
      this.notif.error('Erreur lors de la création : ' + err);
    });
  }

  public delete = (client: Client): Promise<any> => {
    return this.rest.delete('clients', client.id).toPromise().then(resp => {
      this.notif.success('Le client ' + client.name + ' a bien été supprimé.')

      this.clients.first().subscribe(clients => {
        let index = clients.indexOf(client);
        if (index > -1) clients.splice(index, 1);

        this.clients.next(clients);
      });
    });
  }

  public save = (client: Client) => {
    return this.rest.update('clients', client.id, client).toPromise().then(any => {
      this.notif.success('Le client ' + client.name + ' a bien été sauvegardé.')
    }).catch((err) => {
      this.notif.error('Erreur lors de la sauvegarde : ' + err);
    });
  }
}
