import { Injectable } from '@angular/core';

let Configurator = require('Configurator');

@Injectable()
export class Configuration {
    public static server: string = Configurator.api.server;
    public static apiUrl: string = Configurator.api.uri;
    public static serverWithApiUrl = Configuration.server + Configuration.apiUrl;

    public static cacheTimeout: number = Configurator.cache.timeout;

    public static webmailUrl: string = Configurator.urls.webmail;
    public static blogUrl: string = Configurator.urls.blog;
    public static cloudUrl: string = Configurator.urls.cloud;

    public static mailDomain: string = Configurator.mail.domain;
}
