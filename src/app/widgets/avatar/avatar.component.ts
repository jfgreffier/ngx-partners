import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { User } from "../../models/user";

@Component( {
    selector: 'avatar',
    styleUrls: ['./avatar.component.css'],
    templateUrl: './avatar.component.html'
})
export class AvatarComponent implements OnChanges {

  private avatar = null;
  private text;
  private color;

  @Input()
  private allowUpload = false;
  private uploadicon = false;

  @Input()
  private user: User;

  constructor(
  ) {
  }

  public ngOnChanges() {
    if (this.user.firstname) this.text = this.user.firstname.length > 0 ? this.user.firstname[0].toUpperCase() : "";

    this.color = AvatarComponent.hashCode(this.user.username.toLowerCase() + this.user.email.toLowerCase()) % 9 + 1;
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
