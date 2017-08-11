import { Component, OnInit } from '@angular/core';

import { Configuration } from './app.constants';

import '../styles.less';

@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor( ) {

    }

    public ngOnInit() {
      console.log(window.location.protocol);
      if (!window.location.protocol.includes('https') && Configuration.serverWithApiUrl.includes('https://')) {
        window.location.href = window.location.href.replace('http', 'https');
      }
    }

}
