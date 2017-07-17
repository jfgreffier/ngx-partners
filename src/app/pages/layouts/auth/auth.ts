import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { LoggerService } from '../../../services/logger.service';

import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component( {
    selector: 'app-layouts-auth',
    templateUrl: './auth.html'
})
export class LayoutsAuthComponent implements OnInit {
    protected toastrConfig: ToasterConfig;
    private logger: LoggerService;
    protected mylinks: Array<any> = [];

    private currentUrl: string;

    private currentUser: User = new User;

    constructor(
      private userServ: UserService,
      private toastr: ToasterService,
      private router: Router,
    ) {
        this.toastrConfig = new ToasterConfig( {
            newestOnTop: true,
            showCloseButton: true,
            tapToDismiss: false
        });
        this.router.events.subscribe((evt: any) => {
            this.currentUrl = evt.url

            if (this.currentUrl === '' || this.currentUrl === '/')
                this.router.navigate(['/home']);
        });

        this.userServ.currentUser.subscribe((user) => {
            this.currentUser = user;

            this.setupLinks();
        });
    }

    public ngOnInit() {
        //  sedding the resize event, for AdminLTE to place the height
        let ie = this.detectIE();
        if ( !ie ) {
            window.dispatchEvent( new Event( 'resize' ) );
        } else {
            // solution for IE from @hakonamatata
            let event = document.createEvent( 'Event' );
            event.initEvent( 'resize', false, true );
            window.dispatchEvent( event );
        }

        if (this.currentUrl === '' || this.currentUrl === '/')
            this.router.navigate(['/home']);
    }

    public setupLinks() {
        // define here your own links menu structure
        this.mylinks = [
          {
            'title': 'Home',
            'icon': 'dashboard',
            'link': ['/home']
          },
          {
            'title': 'Compte rendu d\'activité',
            'icon': 'calendar',
            'link': ['/report']
          },
        ];

        if (this.currentUser.isAdmin())
          this.mylinks.push(
          {
            'title': 'Administration',
            'icon': 'gears',
            'sublinks': [
              {
                'title': 'Client',
                'icon': 'users',
                'link': ['/clients']
              },
              {
                'title': 'Projets',
                'icon': 'briefcase',
                'link': ['/projects']
              },
              {
                'title': 'Utilisateurs',
                'icon': 'user-circle-o',
                'link': ['/users']
              },
            ]
          },
          );
    }

    protected detectIE(): any {
        let ua = window.navigator.userAgent;

        // Test values; Uncomment to check result …
        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
        // IE 12 / Spartan
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
        // Edge (IE 12+)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)
        // Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

        let msie = ua.indexOf( 'MSIE ' );
        if ( msie > 0 ) {
            // IE 10 or older => return version number
            return parseInt( ua.substring( msie + 5, ua.indexOf( '.', msie ) ), 10 );
        }

        let trident = ua.indexOf( 'Trident/' );
        if ( trident > 0 ) {
            // IE 11 => return version number
            let rv = ua.indexOf( 'rv:' );
            return parseInt( ua.substring( rv + 3, ua.indexOf( '.', rv ) ), 10 );
        }

        let edge = ua.indexOf( 'Edge/' );
        if ( edge > 0 ) {
            // Edge (IE 12+) => return version number
            return parseInt( ua.substring( edge + 5, ua.indexOf( '.', edge ) ), 10 );
        }

        // other browser
        return false;
    }

}
