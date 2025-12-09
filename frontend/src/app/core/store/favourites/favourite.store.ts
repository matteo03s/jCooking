import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap, throwError} from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Favourite, FavouriteJSON } from './model/favourite';
import { NotificationStore } from '../notification/notification.store';
import { HttpErrorResponse } from '@angular/common/http';
import {FavouriteService} from './favourite.service';

interface FavouriteState {
  favourites: Favourite[];
  isLoading: boolean;
}

const initialState: FavouriteState = {
  favourites: [],
  isLoading: false
};

export const FavouriteStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((
    store,
    favouriteService = inject(FavouriteService),
    notificationStore = inject(NotificationStore)
  ) => ({
    loadUserFavourites: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          favouriteService.getUserFavourites().pipe(
            tapResponse({
              next: (favourites: FavouriteJSON[]) => {
                patchState(store, { favourites: favourites.map(Favourite.fromJSON) });
              },
              error: () => notificationStore.notifyError('NOTIFICATION.FAVOURITES.ERROR_LOADING'),
              finalize: () => patchState(store, { isLoading: false })
            })
          )
        )
      )
    ),

    addFavourite: rxMethod<number>(
      pipe(
        switchMap((recipeId: number) =>
          favouriteService.addFavourite(recipeId).pipe(
            tapResponse({
              next: favJSON => {
                const fav = Favourite.fromJSON(favJSON);
                patchState(store, { favourites: [...store.favourites(), fav] });
                notificationStore.notifySuccess('NOTIFICATION.FAVOURITES.ADD_SUCCESS');
              },
              error: (err: HttpErrorResponse) => {
                notificationStore.notifyError('NOTIFICATION.FAVOURITES.POST_FAILED')
                if (err.status === 409) {
                  notificationStore.notifyInfo('NOTIFICATION.FAVOURITES.ADD_ALREADY');
                } else {
                  notificationStore.notifyError('NOTIFICATION.FAVOURITES.ADD_SUCCESS');
                }
                return throwError(() => err);
              }
            })
          )
        )
      )
    ),

    removeFavourite: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((recipeId: number) =>
          favouriteService.removeFavourite(recipeId).pipe(
            tapResponse({
              next: () => {
                patchState(store, {
                  favourites: store.favourites().filter(f => f.recipeId !== recipeId)
                });
                notificationStore.notifySuccess('NOTIFICATION.FAVOURITES.REMOVE_SUCCESS');
              },
              error: () => {
                notificationStore.notifyError('NOTIFICATION.FAVOURITES.REMOVE_FAILED')
              },
              finalize: () => patchState(store, { isLoading: false }),
            })
          )
        )
      )
    ),

    isFavourite(recipeId: number): boolean {
      return store.favourites().some(f => f.recipeId === recipeId);
    }
  }))
);
