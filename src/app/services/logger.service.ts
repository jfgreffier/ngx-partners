import { Injectable, Input } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class LoggerService {

    constructor() {
        // TODO
    }

    public log( component: string, msg?: string, i18nRef?: string, data?: string[] ) {
        if ( i18nRef ) {
            let params: {} = {};
            if ( data ) {
                params = ( data[0] ) ? { 0: data[0] } : params;
                params = ( data[1] ) ? { 0: data[0], 1: data[1] } : params;
                params = ( data[2] ) ? { 0: data[0], 1: data[1], 2: data[2] } : params;
            }
            console.log( component + ': ' + i18nRef );
        } else {
            console.log( component + ': ' + msg );
        }
    }
}
