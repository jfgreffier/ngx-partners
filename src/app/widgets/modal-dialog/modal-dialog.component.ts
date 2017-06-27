import { Component, Input } from '@angular/core';
import { Message } from '../../models/message';
import { MessagesService } from '../../services/messages.service';

@Component( {
    selector: 'modal-dialog',
    templateUrl: './modal-dialog.component.html'
})
export class ModalDialogComponent {

  public visible = false;
  private visibleAnimate = false;

  @Input() private color: string = "default";

  constructor(){}

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

}
