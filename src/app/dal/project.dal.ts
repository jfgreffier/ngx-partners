import { Injectable } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Project } from '../models/project';
import { NotificationService } from '../services/notification.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProjectDAL {
  private projects: Observable<Array<Project>>;

  constructor(private rest: RestService, private notif: NotificationService) { }

  public readAll = (): Observable<Array<Project>> => {
    this.projects = this.rest.getAll('projects');
    return this.projects;
  }

  public read = (id: number): Observable<Project> => {
    return this.rest.get('projects', id);
  }

  public create = (newProject: Project): Observable<Array<Project>> => {
    this.rest.add('projects', newProject).toPromise().then(r => {
      this.notif.success('New project has been added');
      let project: Project = r;

      this.projects = this.projects.map(parray => {
        parray.push(project);
        return parray;
      });
      this.projects.publish();
    });

    return this.projects;
  }

  public update = (id: number, project: Project): void => {
    this.rest.update('projects', id, project).toPromise().then(resp => {
      let project: Project = resp;
      this.notif.success('Project ' + project.name + ' has been updated');

   /* this.projects.map(parray => {
        parray.forEach(p => {
          if (p.id !== project.id) return;

          p = project;
        });
      });*/
    });
  }

  public delete = (project: Project): void => {
    this.rest.delete('projects', project.id).toPromise().then(resp =>
      this.notif.success('Project ' + project.name + ' has been deleted')
    );
  }
}
