import { Injectable, signal, inject } from '@angular/core';
import {Router, NavigationError} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private router = inject(Router);

  showModal = signal(false);
  errorMessage = signal('');
  errorDetails = signal('');
  attemptedUrl = signal('');

  constructor() {
    // intercetta gli errori di navigazione
    this.router.events.subscribe(event => {
      if (event instanceof NavigationError) {
        this.handle(event.error, event.url);
      }
    });
  }

  handle(error: any, attemptedUrl?: string) {

    if (error instanceof HttpErrorResponse) {
      console.warn('[ErrorService] Errore backend ignorato per il modal:', error.message);
      return;
    }
    console.log(error);
    // URL provato (dalla navigazione o richiesta HTTP)
    const url = attemptedUrl || this.router.url;
    this.attemptedUrl.set(url);

    // messaggio leggibile per NG04002
    if (error?.message?.includes('NG04002')) {
      this.errorMessage.set(`Errore di routing: URL non trovato`);
    } else {
      this.errorMessage.set(error?.message || 'Errore imprevisto');
    }

    // mettiamo nell'errorDetails l'URL che l'utente ha provato a raggiungere
    this.errorDetails.set(this.router.currentNavigation.toString());

    this.showModal.set(true);

    // opzionale: redirect alla home solo per errori di routing
    if (error?.message?.includes('NG04002')) {
      this.router.navigate(['/']);
    }
  }

}
