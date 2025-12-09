import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import * as bootstrap from 'bootstrap';

bootstrapApplication(App, appConfig)
  .then(() => {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    [...popoverTriggerList].map(
      (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
    );
  })

  .catch((err) => console.error(err));

