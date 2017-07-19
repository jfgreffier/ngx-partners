import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class BreadcrumbService {
  public current: ReplaySubject<any>;
  private initialData: any = {
    description: '',
    display: false,
    header : '',

    levels: [
      {
        icon: 'clock-o',
        link: ['/'],
        title: 'Default'
      }
    ]
  };

  constructor() {
    this.current = new ReplaySubject(1);
    this.clear();
  }

  public set(data: any) {
    this.current.next(data);
  }

  public push(data: any) {
    this.current.first().subscribe((current: any) => {
      current.levels.push(data);
      this.current.next(current);
    })
  }

  public pop() {
    this.current.first().subscribe((current: any) => {
      current.levels.pop();
      this.current.next(current);
    })
  }

  public clear() {
    this.set(this.initialData);
  }

}
