export class Project {
  public id: number;
  public name: string;

  constructor(id?: number, name?: string) {
    this.id = id || 0;
    this.name = name || 'Projet sans nom';
  }
}
