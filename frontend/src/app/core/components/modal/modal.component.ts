import {Component, Input, WritableSignal, signal, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalTypes} from './modalTypes';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() visible: WritableSignal<boolean> = signal(false);
  @Input() type: WritableSignal<ModalTypes | null> = signal(null);
  @Input() title: WritableSignal<string | null> = signal('Errore');
  @Input() message: WritableSignal<string | null> = signal(null);
  @Input() details: (() => string) | null = null;
  @Input() removing: (() => boolean) | null = null;
//  @Input() details: WritableSignal<string | null> = signal(null);
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
  hide() {
    this.visible.set(false);
  }
}

