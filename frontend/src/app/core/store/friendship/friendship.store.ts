import {inject} from '@angular/core';
import {signalStore, withState, withMethods, patchState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {Friendship, FriendshipJSON} from './model/friendship';
import {FriendshipService} from './friendship.service';
import {NotificationStore} from '../notification/notification.store';

interface FriendshipState {
  friends: Friendship[];
  requests: Friendship[];
  sent: Friendship[];
  received: Friendship[];
  isLoading: boolean;
}

const initialState: FriendshipState = {
  friends: [],
  requests: [],
  sent: [],
  received: [],
  isLoading: false,
};

export const FriendshipStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((
    store,
    friendshipService = inject(FriendshipService),
    notificationStore = inject(NotificationStore)
  ) => ({

    /** Carica lista amici */
    loadFriends: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() =>
          friendshipService.getFriends().pipe(
            tapResponse({
              next: (friends: FriendshipJSON[]) => {
                patchState(store, {friends: friends.map(Friendship.fromJSON)});
                console.log(store.friends)
              },
              error: () => notificationStore.notifyError('Error loading friends'),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        )
      )
    ),

    /** Carica richieste di amicizia (sia ricevute che mandate) */
    loadRequests: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() =>
          friendshipService.getAllPendingRequests().pipe(
            tapResponse({
              next: (requests: FriendshipJSON[]) => {
                patchState(store, {requests: requests.map(Friendship.fromJSON)});
                console.log(store.requests);
              },
              error: () => notificationStore.notifyError('NOTIFICATION.FRIENDSHIP.REQUEST_ERROR'),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        )
      )
    ),
    /** Carica richieste di amicizia ricevute */
    loadReceived: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() =>
          friendshipService.getRequests().pipe(
            tapResponse({
              next: (requests: FriendshipJSON[]) => {
                const received = requests.map(Friendship.fromJSON);
                patchState(store, {
                  received,
                  requests: [...store.requests(), ...received]
                });
                console.log(store.requests);
              },
              error: () => notificationStore.notifyError('NOTIFICATION.FRIENDSHIP.RECEIVED_REQUEST_ERROR'),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        )
      )
    ),

    /** Carica richieste di amicizia mandate */
    loadSent: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() =>
          friendshipService.getSent().pipe(
            tapResponse({
              next: (requests: FriendshipJSON[]) => {
                const sent = requests.map(Friendship.fromJSON);
                patchState(store, {
                  sent,
                  requests: [...store.requests(), ...sent]
                });
//                  {requests: requests.map(Friendship.fromJSON)},
              },
              error: () => notificationStore.notifyError('NOTIFICATION.FRIENDSHIP.SENT_REQUEST_ERROR'),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        )
      )
    ),

    /** Invia una richiesta */
    sendRequest: rxMethod<number>(
      pipe(
        switchMap((receiverId: number) =>
          friendshipService.sendRequest(receiverId).pipe(
            tapResponse({
              next: (f: FriendshipJSON) => {
                patchState(store, {requests: [...store.requests(), Friendship.fromJSON(f)]});
                notificationStore.notifySuccess('Friend request sent!');
              },
              error: (err: HttpErrorResponse) => {
                if (err.status === 409) {
                  notificationStore.notifyInfo('Friend request already sent 💌');
                } else {
                  notificationStore.notifyError('Error sending friend request');
                }
              }
            })
          )
        )
      )
    ),

    /** Risponde a una richiesta */
    respondRequest: rxMethod<{ id: number; accept: boolean }>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(({id, accept}) =>
          friendshipService.respondRequest(id, accept).pipe(
            tapResponse({
              next: (f: FriendshipJSON) => {
                patchState(store, {
                  requests: store.requests().filter(r => r.id !== f.id),
                  friends: accept ? [...store.friends(), Friendship.fromJSON(f)] : store.friends()
                });
                notificationStore.notifySuccess(accept ? 'Friend request accepted!' : 'Friend request declined');
              },
              error: () => notificationStore.notifyError('Error responding to request'),
              finalize: () => patchState(store, {isLoading: false})
            })
          )
        )
      )
    ),

    /** controlla se un utente è già amico */
    isFriend(userId: number): boolean {
      return store.friends().some(f =>
        f.senderId === userId || f.receiverId === userId
      );
    }
  }))
);
