import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { Configuration } from '../app.constants';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class RestService {
  private headers: Headers;
  private requests: Object = new Object;

  constructor(private http: AuthHttp, private config: Configuration) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  // HELPERS

  public cacheValid(modelName: string, maxtime = 0): boolean {
    let json = localStorage.getItem('rest_' + modelName);
    if (json) {
      let obj = JSON.parse(json);
      let valid = (obj && (obj.date > (Date.now() - maxtime)));
      return valid;
    }
    return false;
  }

  public readCache(modelName: string): any {
    let json = localStorage.getItem('rest_' + modelName);
    if (json) {
      let obj = JSON.parse(json);
      return obj.data;
    }
  }

  public writeCache(modelName: string, data: any) {
    let obj = {
      data: data,
      date: Date.now()
    };
    localStorage.setItem('rest_' + modelName, JSON.stringify(obj));
  }

  public clearCache(modelName: string) {
    this.requests[modelName] = null;
    localStorage.removeItem('rest_' + modelName);
  }

  private getActionUrl(modelName: string) {
    return this.config.serverWithApiUrl + modelName + '/';
  }

  // REST functions

  public getAll(entity: string, uri?: string, expire: number = -1): Observable<any[]> {
    if (expire < 0) expire = this.config.cacheTimeout;

    uri = uri || '';
    let modelName = entity + '/' + uri;

    if (this.cacheValid(modelName, expire))
      return Observable.of(this.readCache(modelName));

    if (this.requests[modelName]) {
      if (this.requests[modelName].date && this.requests[modelName].date > (Date.now() - expire)) {
        return this.requests[modelName].observable.first();
      }
    }

    this.http.get(this.getActionUrl(entity) + uri)
      .map((response: Response) => {

        // getting an array having the same name as the model
        let data = response.json()[entity];
        // transforming the array from indexed to associative

        this.writeCache(modelName, data);

        return data;
      })
      .catch(this.handleError)
      .first()
      .subscribe(data => {
        if (!this.requests[modelName]) return;

        this.requests[modelName].observable.next(data);
      });

    this.requests[modelName] = {
      'observable': new ReplaySubject<any>(1),
      'date': Date.now()
    };

    return this.requests[modelName].observable.first();
  }

  public get(entity: string, id?: number, expire: number = -1): Observable<any> {
    if (expire < 0) expire = this.config.cacheTimeout;

    let sid: string = "" + (id || "");
    let modelName = entity + '/' + sid;

    if (this.cacheValid(modelName, expire))
      return Observable.of(this.readCache(modelName));

    if (this.requests[modelName]) {
      if (this.requests[modelName].date && this.requests[modelName].date > (Date.now() - expire)) {
        return this.requests[modelName].observable.first();
      }
    }

    let request = this.http.get(this.getActionUrl(entity) + sid)
      .map((response: Response) => {
        let data = response.json();

        this.writeCache(modelName, data);

        return data;
      })
      .catch(this.handleError)
      .first()
      .subscribe(data => {
        if (!this.requests[modelName]) return;

        this.requests[modelName].observable.next(data);
      });

    this.requests[modelName] = {
      'observable': new ReplaySubject<any>(1),
      'date': Date.now()
    };

    return this.requests[modelName].observable.first();
  }

  public add(entity: string, item: any): Observable<any> {
    let toAdd = JSON.stringify(item);

    this.clearCache(entity + '/');

    return this.http.post(this.getActionUrl(entity), toAdd, { headers: this.headers })
      .map((response: Response) => {
        if (response.status === 200 || response.status === 201)
          return response.text;
      })
      .catch(this.handleError);
  }

  public update(entity: string, id: number, itemToUpdate: any): Observable<any> {
    let sid: string = "" + (id || "");
    let modelName = entity + '/' + sid;

    this.clearCache(modelName);

    return this.http.put(this.getActionUrl(entity) + sid, JSON.stringify(itemToUpdate), { headers: this.headers })
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  public delete(entity: string, id: number): Observable<Response> {
    let sid: string = "" + (id || "");
    let modelName = entity + '/' + sid;

    this.clearCache(modelName);

    return this.http.delete(this.getActionUrl(entity) + id)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json() || ('Server error : ' + error));
  }
}
