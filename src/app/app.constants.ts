import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public server: string = 'http://127.0.0.1:8000/';
    public apiUrl: string = 'api/';
    public serverWithApiUrl = this.server + this.apiUrl;
}
