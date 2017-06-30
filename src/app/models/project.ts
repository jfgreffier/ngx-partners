export class Project {
  public TypeProject = "project";
  public TypeInternalActivity = "activity";

  public id: number;
  public name: string;
  public type: string;

  constructor(id?: number, name?: string, type?: string) {
    this.id = id || 0;
    this.name = name || 'Projet sans nom';
    this.type = type || this.TypeProject;
  }
}
