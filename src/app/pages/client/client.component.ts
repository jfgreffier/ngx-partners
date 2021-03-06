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

  protected clientsProgress: number = 0;
  protected projectsProgress: number = 0;

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
    this.clientsProgress = 1;

    this.clientDal.readAll();

    this.clientDal.clients.subscribe((clients) => {
      this.clients = clients;
      this.clientsProgress = 0;
    });

    this.route.params.subscribe(params => {

      let levels = [ { icon: 'dashboard', link: ['/portal'], title: 'Home' },
          { icon: 'users', link: ['/portal', 'clients'],  title: 'Clients' } ];

      this.clientDal.clients.subscribe((clients) => {
        let client = this.loadClient(clients, +params['id']);

        if (client)
          levels.push({ icon: 'user', link: ['/portal', 'clients', ''+client.id],  title: client.name })

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

      this.projectsProgress = 0;
    });
  }

  public loadClient(clients: Client[], id: number): Client{
    this.projectsProgress = 1;

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
    this.router.navigate(['/portal', 'clients', c.id]);
  }

  public editClient(c: Client): void {
    this.clientsProgress = 1;

    this.clientDal.save(c)
      .then(() =>  this.clientsProgress = 0)
      .catch(() =>  this.clientsProgress = 0);
  }

  public deleteClient(c: Client): void {
    this.clientsProgress = 1;

    this.clientDal.delete(c).then(any => {
      if (this.selectedClient && this.selectedClient.id === c.id)
        this.router.navigate(['/portal', 'clients']);
    })
    .then(() =>  this.clientsProgress = 0)
    .catch(() =>  this.clientsProgress = 0);
  }

  public createClient(data: Object): void {
    let newClient = new Client(data);

    this.clientDal.create(newClient).then((client: Client) => {
      this.selectClient(client);
    });
    newClient = new Client();
  }

  public addProject(project: Project) {
    this.projectsProgress = 1;

    project.status = Project.StatusActive;
    project.client = this.selectedClient;

    this.projectDal.create(new Project(project))
    .then(() => this.projectsProgress = 0)
    .catch(() => this.projectsProgress = 0);
  }
}
