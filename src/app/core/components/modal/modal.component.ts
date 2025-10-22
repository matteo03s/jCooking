import { Component, Input, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent {
  @Input() visible: WritableSignal<boolean> = signal(false);
  @Input() title: WritableSignal<string | null> = signal('Errore');
  @Input() message: WritableSignal<string | null> = signal(null);
  @Input() details: WritableSignal<string | null> = signal(null);

  hide() {
    this.visible.set(false);
  }
}

