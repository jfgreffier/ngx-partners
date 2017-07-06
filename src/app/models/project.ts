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
    this.name = data.name || 'Projet sans nom';
    this.type = data.type || Project.TypeProject;
    this.status = data.status || Project.StatusInactive;

    this.client = new Client(data.client);
  }

  public isActive = (): boolean => {
    return this.status == Project.StatusActive;
  }
}
