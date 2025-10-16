import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import * as bootstrap from 'bootstrap'; // importa tutto Bootstrap

bootstrapApplication(App, appConfig)

  .then(() => {
    // Attiva tutti i popover quando Angular è pronto
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    [...popoverTriggerList].map(
      (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
    );
  })

  .catch((err) => console.error(err));

