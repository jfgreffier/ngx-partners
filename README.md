Partners Slickteam
==================

Portal built with Angular 4, using RESTful backend.

Based on [ng2-admin-lte](https://github.com/TwanoO67/bootstraping-ngx-admin-lte/tree/angular2).

Features
--------

* Activity reports : submit, browse history, lookup by projects or partners.
* Admin interface for users, projects and clients management.
* Frontend for SSO/SAML authentication.

Install dependencies
--------------------
```bash
npm install
```

Lauching with npm
-----------------
```bash
npm start
```

Deployment
----------

### Create or update config file `config/config.prod.json`
```yaml
{
    "api": {
        "server": "http://www.web.site/",
        "uri": "api/"
    },
    "cache": {
        "timeout": 10000
    },
    "urls": {
        "webmail": "",
        "blog": "",
        "cloud": ""
    },
    "mail": {
        "domain": "mywebsite.com"
    }
}
```
* `urls` are tiles in the dashboard home page
* `mail.domain` is used to generate mail adresses

### Build with npm
```bash
npm run build
```

### Upload
Upload all files in the `dist` folder to a web server.