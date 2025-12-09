import {signalStore, withState, withMethods, patchState, withComputed, withProps} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, catchError, of, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {User, UserJSON} from './model/user';
import {NotificationStore} from '../notification/notification.store';
import {HttpErrorResponse} from '@angular/common/http';
import {computed, inject} from "@angular/core";
import {UserService} from './services/user-service';
import {LocalStorageService} from '../../services/local-storage.service';
import {Router} from '@angular/router';
import {FavouriteStore} from '../favourites/favourite.store';

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  otherUsers: User[]
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  otherUsers: []
};

export const UserStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withComputed((store) => ({
    isLogged: computed(() => !!store.currentUser()),
    fullName: computed(() =>
      store.currentUser() ? `${store.currentUser()!.name} ${store.currentUser()!.surname}` : 'Guest'
    ),
    username: computed(() => {
      const user = store.currentUser();
      console.log('Computed username called with user:', user);
      return user?.username || user?.email || '';
    })
  })),
  withProps((store) => ({
    userLoaded: computed(() => !!store.currentUser())
  })),
  withMethods(
    (
      store,
      router = inject(Router),
      userService = inject(UserService),
      notificationStore = inject(NotificationStore),
      favouriteStore = inject(FavouriteStore),
      localStorageService = inject(LocalStorageService)
    ) => ({

      init: () => {
        const username = localStorageService.getItem('username');
        if (username) {
          patchState(store, {isLoading: true});
          userService.getByUsername(username).pipe(
            tapResponse({
              next: (userJSON: UserJSON) => {
                const user = User.fromJSON(userJSON);
                patchState(store, {currentUser: user});
                notificationStore.notifySuccess('NOTIFICATION.USER.LOAD_SUCCESS');
                console.log(store.currentUser())
              },
              error: (err: HttpErrorResponse) => {
                console.error('Errore nel ricaricare utente da local storage:', err);
                notificationStore.notifyError('NOTIFICATION.USER.LOAD_FAILED');
                localStorageService.removeItem('username');
              },
              finalize: () => patchState(store, {isLoading: false})
            }),
            catchError(() => of(null))
          ).subscribe();
          favouriteStore.loadUserFavourites();
        }
      },

      // Carica i dati di un utente dal backend
      loadUser: rxMethod<string>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap((username: string) =>
            userService.getByUsername(username).pipe(
              tapResponse({
                next: (userJSON: UserJSON) => {

                  console.log('User JSON ricevuto:', userJSON);
                  const user = User.fromJSON(userJSON);
                  console.log('User creato:', user);
                  patchState(store, {currentUser: user});
                  console.log('Stato dopo patch:', store.currentUser());

                  notificationStore.notifySuccess('NOTIFICATION.USER.LOAD_SUCCESS');
                  console.log(user.username);
                  localStorageService.setItem('username', user.username!);
                },
                error: (err: HttpErrorResponse) => {
                  notificationStore.notifyError('NOTIFICATION.USER.LOAD_FAILED');
                },
                finalize: () => patchState(store, {isLoading: false}),
              }),
              catchError(() => of(null))
            )
          )
        )
      ),
// Aggiorna i dati dell'utente corrente
      updateUser: rxMethod<User>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((user: User) =>
            userService.updateUser(user.id!, User.toJSON(user)).pipe(
              tapResponse({
                next: (updatedUserJSON: UserJSON) => {
                  const updatedUser = User.fromJSON(updatedUserJSON);

                  patchState(store, { currentUser: updatedUser });
                  localStorageService.setItem('username', updatedUser.username!);
                  notificationStore.notifySuccess('NOTIFICATION.USER.EDIT_SUCCESS');
                  router.navigateByUrl('/users/my')
                },
                error: (err: HttpErrorResponse) => {
                  console.error('Errore durante updateUser:', err);
                  notificationStore.notifyError('NOTIFICATION.USER.EDIT_SUCCESS');
                },
                finalize: () => patchState(store, { isLoading: false })
              }),
              catchError(() => {
                patchState(store, { isLoading: false });
                return of(null);
              })
            )
          )
        )
      ),
      //per caricare tutti gli altri utenti (eccetto me stesso)
      loadAllUsers: rxMethod<void>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap(() =>
            userService.getAll().pipe(
              tapResponse({
                next: (users: UserJSON[]) => {
                  patchState(store, {otherUsers: users.map(User.fromJSON)});
                },
                error: () => notificationStore.notifyError('NOTIFICATION.USER.USERS_FAILED'),
                finalize: () => patchState(store, {isLoading: false})
              })
            ))
        )
      ),
      //per caricare gli utenti con più ricette scritte
      loadBestUsers: rxMethod<void>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap(() =>
            userService.getBest().pipe(
              tapResponse({
                next: (users: UserJSON[]) => {
                  patchState(store, {otherUsers: users.map(User.fromJSON)});
                },
                error: () => notificationStore.notifyError('NOTIFICATION.USER.TOP_USERS_FAILED'),
                finalize: () => patchState(store, {isLoading: false})
              })
            ))
        )
      ),


      getUsername: () => localStorageService.getItem('username'),
      getUser: (username: string) => {
        return userService.getByUsername(username);
      },

      clearUser: () => {
        patchState(store, {currentUser: null});
        localStorageService.removeItem('username');
      }
    })
  )
);
