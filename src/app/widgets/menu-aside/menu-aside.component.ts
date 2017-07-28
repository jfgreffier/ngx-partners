import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu-aside',
  styleUrls: ['./menu-aside.component.css'],
  templateUrl: './menu-aside.component.html'
})
export class MenuAsideComponent implements OnInit {
  protected currentUrl: string;
  protected currentUser: User = new User();

  @Input() protected links: Array<any> = [];

  constructor(private userServ: UserService, public router: Router) {
    // getting the current url
    this.router.events.subscribe((evt: any) => this.currentUrl = evt.url);
    this.userServ.currentUser.subscribe((user) => this.currentUser = user);
  }

  public ngOnInit() {

  }

  public hasSubLinks(item: any): boolean {
    return item.sublinks;
  }

  public isCurrentLink(link: string[]): boolean {
    if (!this.currentUrl) return false;
    return this.currentUrl.startsWith(link.join('/'));
  }

  public isSubLinkCurrentLink(item: any): boolean {
    let current = false;
    item.sublinks.forEach((subitem: any) => {
      if (this.isCurrentLink(subitem.link)) current = true;
    });

    return current;
  }

}
