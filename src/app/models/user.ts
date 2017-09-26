import { Configuration } from '../app.constants';

import { AccentsHelper } from '../helpers/accents.helper'

export class User {
    public id: number;
    public username: string;
    public firstname: string;
    public lastname: string;
    public email: string;
    public proEmail: string;
    public role: string;
    public enabled: boolean;

    public generateProEmail: boolean;

    public avatarUrl: string;
    public creationDate: string;
    public preferredLang: string;

    public connected: boolean = false;

    public constructor(data: any = {}) {
        this.id = data.id || null;
        this.username = data.username || '';
        this.firstname = data.firstname || '';
        this.lastname = data.lastname || '';
        this.email = data.email || '';
        this.proEmail = data.proEmail || '';
        this.role = data.role || 'ROLE_USER';
        this.enabled = data.enabled || false;

        this.generateProEmail = data.generateProEmail || false;

        this.avatarUrl = data.avatarUrl || '';
        this.creationDate = data.creation_date || Date.now();
        this.preferredLang = data.preferredLang || null;

        this.connected = data.connected || false;
    }

    public getName() {
        return this.firstname + ' ' + this.lastname;
    }

    public isAdmin(): boolean {
        return this.role == 'ROLE_ADMIN';
    }

    public updateProEmail() {
        let sanitizedFirstname = AccentsHelper.removeDiacritics(this.firstname).replace(/[^A-Za-z0-9]+/g, '-').toLowerCase();
        let sanitizedLastname = AccentsHelper.removeDiacritics(this.lastname).replace(/[^A-Za-z0-9]+/g, '').toLowerCase();

        this.proEmail = sanitizedFirstname;

        if (sanitizedFirstname.length && sanitizedLastname.length)
            this.proEmail += '.';

        this.proEmail += sanitizedLastname;

        this.proEmail += '@' + Configuration.mailDomain;
    }

    public trimForUsers() {
        return {
            id: this.id,
            username: this.username,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
        }
    }
}
