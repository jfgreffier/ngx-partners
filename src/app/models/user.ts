export class User {
    public id: number;
    public username: string;
    public firstname: string;
    public lastname: string;
    public email: string;
    public role: string;
    public enabled: boolean;

    public avatarUrl: string;
    public creationDate: string;
    public preferredLang: string;

    public connected: boolean = false;

    public constructor( data: any = {}) {
        this.id = data.id || null;
        this.username = data.username || '';
        this.firstname = data.firstname || '';
        this.lastname = data.lastname || '';
        this.email = data.email || '';
        this.role = data.role || 'ROLE_USER';
        this.enabled = data.enabled || false;

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
}
