import {computed, inject} from '@angular/core';
import {signalStore, withState, withMethods, patchState, withComputed} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, catchError, of, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AuthService } from './services/authentication-service';
import { Credentials } from './model/credentials';
import { User } from './model/user';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import {NotificationStore} from '../notification/notification.store';
import {UserStore} from './user.store';

interface AuthState {
  isLoading: boolean;
  token: string | null;
  isLogged: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  token: null,
  isLogged: false
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    tokenSignal: computed(() => store.token())
  })),
  withMethods(
    (store,
     authService = inject(AuthService),
     localStorageService = inject(LocalStorageService),
     router = inject(Router),
     notificationStore = inject(NotificationStore),
     userStore = inject(UserStore)
    ) => ({

      /** Registra utente */
      registerUser: rxMethod<{ credentials: Credentials, user: User }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(({ credentials, user }) =>
            authService.register(
              Credentials.toJSON(credentials),
              User.toJSON(user)
            ).pipe(
              tapResponse({
                next: (message: string) => {
                  console.log('✅ Registration OK:', message);
                  notificationStore.notifySuccess('NOTIFICATION.AUTH.REGISTRATION_SUCCESS')
                  router.navigateByUrl('/sign-in');
                },
                error: (err: HttpErrorResponse) => {
                  const msg = err.error?.message || err.message || 'Errore durante la registrazione.';
                  console.error('❌ Registration failed:', msg);
                  notificationStore.notifyError('NOTIFICATION.AUTH.REGISTRATION_FAILED');
                },
/*                error: (err: HttpErrorResponse) => {
                  console.error('❌ Registration failed:', err);
                  notificationStore.notifyError('Credenziali non valide.');
//                  alert('Errore durante la registrazione.');
                },*/
                finalize: () => patchState(store, { isLoading: false })
              }),
              catchError(() => of(null))
            )
          )
        )
      ),

      /**
       * LOGIN
       */
      loginUser: rxMethod<Credentials>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((credentials: Credentials) =>
            authService.login(Credentials.toJSON(credentials)).pipe(
              tapResponse({
                next: (res) => {
                  localStorageService.setItem('token', res.token);
                  patchState(store, { token: res.token, isLogged: true });
                  console.log('Token appena salvato:', res.token);

                  notificationStore.notifySuccess('NOTIFICATION.AUTH.LOGIN_SUCCESS')

                  userStore.loadUser(credentials.username);

                  router.navigateByUrl('/users/my');
//                  window.location.href = '/users/my';
                },
                error: (err: HttpErrorResponse) => {
                  console.error('❌ Login failed:', err);
                  notificationStore.notifyError('NOTIFICATION.AUTH.LOGIN_FAILED');
                },
                finalize: () => patchState(store, {
                  isLoading: false })
              }),
              catchError(() => of(null))
            )
          )
        )
      ),

      /**
       * LOGOUT
       */
      logoutUser: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() => {
        console.log("logout");
            localStorageService.removeItem('token');
            patchState(store, { token: null, isLogged: false });

        console.log("logout");
            notificationStore.notifySuccess('NOTIFICATION.AUTH.LOGOUT_SUCCESS');

            userStore.clearUser();

            return of(null);
          }),
          tapResponse({
            next: () => {
              router.navigateByUrl('/sign-in');
            },
            error: (err) => {
              console.error('Errore durante il logout:', err);
              notificationStore.notifyError('NOTIFICATION.AUTH.LOGOUT_SUCCESS');
            },
            finalize: () => patchState(store, { isLoading: false })
          })
        )
      ),


      resetStore: () => {
        patchState(store, { token: null, isLoading: false });
        localStorageService.removeItem('token');
      },

      /**
       * GET TOKEN
       */
      getToken: () => localStorageService.getItem('token'),
      setToken: (token: string) => patchState(store, { token }),

      init: () => {
        const token = localStorageService.getItem('token');
        if (token) {
          patchState(store, { token });
        }
      }

    })
  )
);
