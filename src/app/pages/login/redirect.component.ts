import { Component, Input, OnChanges } from '@angular/core';
import { AppModule } from '../../app.module';

var $ = require("jquery");

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html'
})
export class RedirectComponent implements OnChanges {

  @Input() protected acu: string;
  @Input() protected relayState: string;
  @Input() protected response: string;

  constructor() {

  }

  ngOnChanges(): void {
    setTimeout(() => {
      $("#redirectButton").click();
    }, 200);
  }

  redirect(): void {
    setTimeout(() => {
      $("#redirectForm").submit();
    }, 200);
  }

}
