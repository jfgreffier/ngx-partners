export class Client {
  public id: number;
  public name: string;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
  }
}
