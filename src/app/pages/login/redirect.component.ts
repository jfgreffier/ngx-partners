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
    $("#redirectForm")[0].action = this.acu;
    $("#redirectForm #SAMLResponse")[0].value = this.response;
    $("#redirectForm #RelayState")[0].value = this.relayState;
    $("#newTabRedirectForm")[0].action = this.acu;
    $("#newTabRedirectForm #SAMLResponse")[0].value = this.response;
    $("#newTabRedirectForm #RelayState")[0].value = this.relayState;
  }

  redirect(): void {
    var isFirefox = typeof InstallTrigger !== 'undefined';

    if (isFirefox) {
      setTimeout(() => {
        $("#newTabRedirectForm").submit();
        window.close();
      }, 200);
    } else {
      setTimeout(() => {
        $("#redirectForm").submit();
      }, 200);
    }

  }

}
