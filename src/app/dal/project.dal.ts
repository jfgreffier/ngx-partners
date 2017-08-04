import { Injectable } from '@angular/core';
import { RestService } from '../services/rest.service';
import { NotificationService } from '../services/notification.service';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { Project } from '../models/project';
import { Client } from '../models/client';
import { User } from '../models/user';

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

    this.rest.getAll('projects', 'by-client/' + client.id).first().toPromise().then(projects => {
      let array = new Array<Project>();
      projects.forEach(p => { array.push(new Project(p)); });
      this.projects.next(array);
    });
  }

  public readByUser = (user: User) => {
    let u: string = user ? 'by-user/'+user.id : 'me';

    return this.rest.getAll('projects', u).first().map(data => {
      let array = new Array<Project>();
      data.forEach(p => { array.push(new Project(p)); });
      return array;
    }).toPromise();
  }

  public read = (id: number): Observable<Project> => {
    return this.rest.get('projects', id);
  }

  public create = (newProject: Project): Promise<any> => {
    return this.rest.add('projects', newProject.flat()).first().toPromise().then((res) => {
      this.notif.success('Le projet "' + newProject.name + '" a bien été créé.');
      let u: Project = new Project(res.project);

      this.projects.first().subscribe(users => {
        users.push(u);
        this.projects.next(users);
      });
    }).catch((err) => {
      this.notif.error('Erreur lors de la création : ' + err);
    });
  }

  public delete = (project: Project): Promise<void> => {
    return this.rest.delete('projects', project.id).toPromise().then(resp => {
      this.notif.success('Le projet ' + project.name + ' a bien été supprimé.')

      this.projects.first().subscribe(projects => {
        let index = projects.indexOf(project);
        if (index > -1) projects.splice(index, 1);

        this.projects.next(projects);
      });
    });
  }

  public save = (project: Project) => {
    return this.rest.update('projects', project.id, project.flat()).toPromise().then(any => {
      this.notif.success('Le projet ' + project.name + ' a bien été sauvegardé.')
    }).catch((err) => {
      this.notif.error('Erreur lors de la sauvegarde : ' + err);
    });
  }
}
