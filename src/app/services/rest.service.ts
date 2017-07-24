import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class RestService {
    public modelName: string;
    private headers: Headers;

    // cache data
    public lastGetAll: Array<any>;
    public lastGet: any;

    constructor(private http: AuthHttp, private config: Configuration) {
      this.modelName = "";
      this.headers = new Headers();
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Accept', 'application/json');
    }

    // HELPERS
    public getAllFromLS(maxtime = 0): Array<any> {
      let json = localStorage.getItem( 'rest_all_' + this.modelName );
      if ( json ) {
        let obj = JSON.parse(json);
        if ( obj && (obj.date < (Date.now() - maxtime) ) ) {
          return obj;
        }
      }
    }


    public getFromCache(id: number): any {
      if (this.lastGetAll) {
        return this.lastGetAll.find((unit) => unit.id === id);
      } else {
        return null;
      }
    }

    private getActionUrl() {
      return this.config.serverWithApiUrl + this.modelName + '/';
    }


    // REST functions
    public getAll(entity: string, uri?: string): Observable<any[]> {
        uri = uri || '';
        this.modelName = entity + uri;
        return this.http.get(this.getActionUrl())
            .map((response: Response) => {
              // getting an array having the same name as the model
              let data = response.json()[entity];
              // transforming the array from indexed to associative
              let tab = data;
              this.lastGetAll = tab;
              let obj = {
                data: tab,
                date: Date.now()
              };
              localStorage.setItem( 'rest_all_' + this.modelName + uri, JSON.stringify(obj) );
              return tab;
            })
            .catch(this.handleError);
    }

    public get(entity: string, id?: number): Observable<any> {
        let sid: string = "" + (id || "");
        this.modelName = entity;
        return this.http.get(this.getActionUrl() + sid)
            .map((response: Response) => {
              let data = response.json();
              this.lastGet = data;
              return data;
            })
            .catch(this.handleError);
    }

    public add(entity: string, item: any): Observable<any> {
        this.modelName = entity;
        let toAdd = JSON.stringify(item);

        return this.http.post(this.getActionUrl(), toAdd, { headers: this.headers })
        .map((response: Response) => {
          if (response.status === 200 || response.status === 201)
            return response.text;
        })
        .catch(this.handleError);
    }

    public update(entity: string, id: number, itemToUpdate: any): Observable<any> {
        this.modelName = entity;
        return this.http.put(this.getActionUrl() + (id || ""), JSON.stringify(itemToUpdate), { headers: this.headers })
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    public delete(entity: string, id: number): Observable<Response> {
        this.modelName = entity;
        return this.http.delete(this.getActionUrl() + id)
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
