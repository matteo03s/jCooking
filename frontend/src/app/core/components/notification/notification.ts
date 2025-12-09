import { Component, computed, inject } from '@angular/core';
import {NgClass} from '@angular/common';
import {NotificationStore} from '../../store/notification/notification.store';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NgClass, TranslatePipe],
  templateUrl: './notification.html',
  styles: [`
    .toast-container { pointer-events: none; }
    .toast { pointer-events: auto; }
  `]
})
export class NotificationComponent {
  store = inject(NotificationStore);
  notifications = computed(() => this.store.notifications());

  remove(id: string) {
    this.store.removeNotification(id);
  }

  /** 🔥 Restituisce la classe Bootstrap per colore */
  getToastClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-success';
      case 'error': return 'bg-danger';
      case 'info': return 'bg-info';
      case 'warning': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  }

  /** 🔥 Restituisce un’icona per tipo di notifica */
  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      default: return '🔔';
    }
  }
}
