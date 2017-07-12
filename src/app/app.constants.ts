import { Injectable } from '@angular/core';

let Configurator = require('Configurator');

@Injectable()
export class Configuration {
    public server: string = Configurator.api.server;
    public apiUrl: string = Configurator.api.uri;
    public serverWithApiUrl = this.server + this.apiUrl;
}
