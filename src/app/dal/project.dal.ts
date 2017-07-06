import { Injectable } from '@angular/core';
import { RestService } from '../services/rest.service';
import { NotificationService } from '../services/notification.service';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { Project } from '../models/project';
import { Client } from '../models/client';

@Injectable()
export class ProjectDAL {
  public projects: ReplaySubject<Array<Project>> = new ReplaySubject<Array<Project>>( 1 );

  constructor(private rest: RestService, private notif: NotificationService) { }

  public readAll = () => {
    this.rest.getAll('projects').toPromise().then(projects => {
      let array = new Array<Project>();
      projects.forEach(p => { array.push(new Project(p)); });
      this.projects.next(array);
    });
  }

  public readByClient = (client: Client) => {
    if (!client) return;

    this.rest.getAll('projects', '/by-client/' + client.id).first().toPromise().then(projects => {
      let array = new Array<Project>();
      projects.forEach(p => { array.push(new Project(p)); });
      this.projects.next(array);
    });
  }

  public read = (id: number): Observable<Project> => {
    return this.rest.get('projects', id);
  }

  public create = (newProject: Project) => {
    this.rest.add('users', newProject).first().toPromise().then((res) => {
      this.notif.success('Le projet a bien été créé.');
      let u: Project = new Project(res.project);

      this.projects.first().subscribe(users => {
        users.push(u);
        this.projects.next(users);
      });
    }).catch((err) => {
      this.notif.error('Erreur lors de la création : ' + err);
    });
  }

  public delete = (project: Project): void => {
    this.rest.delete('projects', project.id).toPromise().then(resp =>
      this.notif.success('Project ' + project.name + ' has been deleted')
    );
  }
}
