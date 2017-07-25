import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { User } from "../../models/user";

@Component( {
    selector: 'avatar',
    styleUrls: ['./avatar.component.css'],
    templateUrl: './avatar.component.html'
})
export class AvatarComponent implements OnChanges {

  protected avatar: string = null;
  protected text: string;
  protected color: number;

  @Input()
  protected allowUpload = false;
  protected uploadicon = false;

  @Input()
  protected user: User;

  protected title: string = "";

  constructor(
  ) {
  }

  public ngOnChanges() {
    if (!this.user){
      this.title = this.text = '';
      return;
    }

    let username = this.user.username || '';
    let firstname = this.user.firstname || '';
    let lastname = this.user.lastname || '';
    let email = this.user.email || '';

    this.text = firstname.length > 0 ? firstname[0].toUpperCase() : "";

    this.color = AvatarComponent.hashCode(username.toLowerCase() + firstname.toLowerCase() + email.toLowerCase()) % 9 + 1;
    this.title = firstname + ' ' + lastname;
  }

  public upload() {

  }

  private static hashCode = function(s: string) {
    let hash = 0, i = 0, len = s.length;
    while ( i < len ) {
      hash  = ((hash << 5) - hash + s.charCodeAt(i++)) << 0;
    }
    return (hash + 2147483647) + 1;
  };
}
