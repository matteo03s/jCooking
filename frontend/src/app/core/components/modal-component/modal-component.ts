import {Component, Input, Output, EventEmitter, inject} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: 'modal-component.html',
  styleUrls: [
    'modal-component.html',
    '../modal/modal.component.scss'
  ],
  imports: [
    TranslatePipe
  ],
  standalone: true
})
export class ConfirmModalComponent {
  public readonly bsModalRef = inject(BsModalRef);
  @Input() title = 'Conferma';
  @Input() message = 'Sei sicuro di voler procedere?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.bsModalRef.hide();
  }

  onCancel() {
    this.cancel.emit();
    this.bsModalRef.hide();
  }
}
