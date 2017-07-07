import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { BreadcrumbService } from '../../services/breadcrumb.service';

import { Client } from '../../models/client';
import { Project } from '../../models/project';
import { User } from '../../models/user';

import { ClientDAL } from '../../dal/client.dal';
import { ProjectDAL } from '../../dal/project.dal';
import { UserDAL } from '../../dal/user.dal';

@Component({
  providers: [ClientDAL, ProjectDAL, UserDAL],
  selector: 'app-client',
  styleUrls: ['./client.component.css'],
  templateUrl: './client.component.html'
})
export class ClientComponent implements OnInit, OnDestroy {
  protected clients: Array<Client> = new Array<Client>();

  protected selectedClient: Client = null;
  protected clientProjects: Array<Project> = new Array<Project>();
  protected projectUsers: Array<Object> = new Array<Object>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadServ: BreadcrumbService,
    private clientDal: ClientDAL,
    private projectDal: ProjectDAL,
    private userDal: UserDAL,
  ) {
  }

  public ngOnInit() {
    this.clientDal.readAll();

    this.clientDal.clients.subscribe((clients) => {
      this.clients = clients;
    });

    this.route.params.subscribe(params => {

      let levels = [ { icon: 'dashboard', link: ['/'], title: 'Home' },
          { icon: 'users', link: ['/clients'],  title: 'Clients' } ];

      this.clientDal.clients.subscribe((clients) => {
        let client = this.loadClient(clients, +params['id']);

        if (client)
          levels.push({ icon: 'user', link: ['/clients', ''+client.id],  title: client.name })

        this.breadServ.set({
          header: 'Gestion des clients',
          description: client ? client.name : '',
          display: true,
          levels
        });
      });
    });

    this.projectDal.projects.subscribe((projects) => {
      this.clientProjects = projects;

      projects.forEach(p => {
        this.projectUsers[p.id] = new Array<User>();

        this.userDal.readByActivity(p).then(users => {
          this.projectUsers[p.id] = users;
        })
      });
    });
  }

  public loadClient(clients: Client[], id: number): Client{
    let client: Client;
    clients.forEach(it => {
      if (it.id === id) client = it;
    });

    this.selectedClient = client;

    this.projectDal.readByClient(client);

    return client;
  }

  public ngOnDestroy() {
    this.breadServ.clear();
  }

  public getNbActive(): number {
    let count = 0;
    this.clientProjects.forEach(p => count += p.status != Project.StatusInactive ? 1 : 0);
    return count;
  }

  public getNbInactive(): number {
    let count = 0;
    this.clientProjects.forEach(p => count += p.status == Project.StatusInactive ? 1 : 0);
    return count;
  }

  public selectClient(c: Client): void {
    this.router.navigate(['/clients', c.id]);
  }

  public editClient(c: Client): void {
    this.clientDal.save(c);
  }

  public deleteClient(c: Client): void {
    this.clientDal.delete(c).then(any => {
      if (this.selectedClient && this.selectedClient.id === c.id)
        this.router.navigate(['/clients']);
    });
  }

  public createClient(data: Object): void {
    let newClient = new Client(data);

    this.clientDal.create(newClient).then((client: Client) => {
      this.selectClient(client);
    });
    newClient = new Client();
  }
}
