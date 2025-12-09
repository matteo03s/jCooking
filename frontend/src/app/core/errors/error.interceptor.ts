import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from './error.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '../services/local-storage.service';
import {NotificationStore} from '../store/notification/notification.store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      const token = localStorageService.getItem('token');

      // 🔥 Se NON c'è token → utente guest → NON fare nulla di speciale
      if (error.status === 401 && token) {
        console.warn('Token scaduto o non valido. Logout automatico.');

        // Rimuovo token
        localStorageService.removeItem('token');

        // Reindirizzo alla login (opzionale)
        router.navigateByUrl('/sign-in');
      }

      // Passo sempre l'errore all'ErrorService
      errorService.handle(error, req.url);

      return throwError(() => error);
    })
  );
};
