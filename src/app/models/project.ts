import { Client } from "../models/client";

export class Project {
  public static TypeProject = "project";
  public static TypeInternalActivity = "activity";

  public static StatusInactive: number = 0;
  public static StatusActive: number = 1;

  public id: number;
  public name: string;
  public client: Client;
  public type: string;
  public status: number;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.name = data.name || null;
    this.type = data.type || Project.TypeProject;
    this.status = data.status || Project.StatusInactive;

    if (data.client && !data.client.id) this.client = new Client({ 'id': data.client });
    else this.client = new Client(data.client);
  }

  public flat() {
    return {
      'id': this.id,
      'name': this.name,
      'type': this.type,
      'status': this.status,
      'client': this.client.id,
    }
  }

  public isActive = (): boolean => {
    return this.status == Project.StatusActive;
  }

  public getStatus(): string { return ""+this.status; }
  public setStatus(s: string) { this.status = parseInt(s); }

  public static statusArray(): Array<Object> {
    let status = new Array<Object>();

    status.push({'value': Project.StatusActive, 'name': 'Actif'});
    status.push({'value': Project.StatusInactive, 'name': 'Archivé'});

    return status;
  }
}
