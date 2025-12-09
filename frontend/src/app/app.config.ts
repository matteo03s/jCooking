import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/store/authentication/guard-interceptor/auth.interceptor';
import { GlobalErrorHandler } from './core/errors/global-error.handler';
import { errorInterceptor } from './core/errors/error.interceptor';
import { BsModalService } from 'ngx-bootstrap/modal';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`./assets/i18n/${lang}.json`);
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    BsModalService,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),

    provideHttpClient(withInterceptors([AuthInterceptor, errorInterceptor])),

    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'it'
      })
    ),

    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
