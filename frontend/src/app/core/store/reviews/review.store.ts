import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject, computed } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationStore } from '../notification/notification.store';
import { ErrorService } from '../../errors/error.service';
import { ReviewService } from './review.service';
import { Review, ReviewJSON } from './model/review';
import { ApiError } from '../../model/api-error';
import {Router} from '@angular/router';

interface ReviewState {
  isLoading: boolean;
  reviews: Review[];
}

const initialState: ReviewState = {
  isLoading: false,
  reviews: [],
};

export const ReviewStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    reviewCount: computed(() => store.reviews().length),
    hasReviews: computed(() => store.reviews().length > 0),
  })),
  withMethods(
    (
      store,
      router = inject(Router),
      reviewService = inject(ReviewService),
      notificationStore = inject(NotificationStore),
      errorService = inject(ErrorService)
    ) => ({

      /** Recupera tutte le recensioni */
      getAllReviews: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            reviewService.getAll().pipe(
              tapResponse({
                next: (reviewsJSON: ReviewJSON[]) => {
                  patchState(store, { reviews: reviewsJSON.map(
                    (reviewsJSON: ReviewJSON)=> Review.fromJSON(reviewsJSON))});
                },
                error: (err: HttpErrorResponse) => {
                  const apiError = err.error as ApiError;
                  notificationStore.notifyError('NOTIFICATION.REVIEWS.ERROR_LOADING');
                  errorService.handle(err, 'ERROR LOADING REVIEWS');
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),

      /** Recupera recensioni per ricetta */
      getReviewsByRecipe: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((recipeId: number) =>
            reviewService.getByRecipe(recipeId).pipe(
              tapResponse({
                next: (reviewsJSON: ReviewJSON[]) => {
                  patchState(store, { reviews: reviewsJSON.map(
                      (reviewsJSON: ReviewJSON)=> Review.fromJSON(reviewsJSON))});
                },
                error: (err: HttpErrorResponse) => {
                  notificationStore.notifyError('NOTIFICATION.REVIEWS.ERROR_RECIPE');
                  errorService.handle(err, 'ERROR LOADING REVIEWS BY RECIPE');
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),

      /** Recupera recensioni per autore */
      getReviewsByUser: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((username: string) =>
            reviewService.getByUser(username).pipe(
              tapResponse({
                next: (reviewsJSON: ReviewJSON[]) => {
                  patchState(store, { reviews: reviewsJSON.map(
                      (reviewsJSON: ReviewJSON)=> Review.fromJSON(reviewsJSON))});
                },
                error: (err: HttpErrorResponse) => {
                  notificationStore.notifyError('NOTIFICATION.REVIEWS.ERROR_AUTHOR');
                  errorService.handle(err, 'ERROR LOADING REVIEWS BY USER');
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),

      /** Crea una nuova recensione */
      addReview: rxMethod<{ review: Review; recipeId: number }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(({ review, recipeId }) =>

            reviewService.create(review, recipeId).pipe(
              tapResponse({
                next: (createdReviewJSON: ReviewJSON) => {

                  patchState(store, {
                    reviews: [...store.reviews(), Review.fromJSON(createdReviewJSON)]
                  });
                  notificationStore.notifySuccess('NOTIFICATION.REVIEWS.POST_SUCCESS');
                  router.navigateByUrl('/reviews')
                },
                error: (err: HttpErrorResponse) => {
                  notificationStore.notifyError('NOTIFICATION.REVIEWS.POST_FAILED');
                  errorService.handle(err, 'ERROR ADDING REVIEW');
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),

      /** Elimina una recensione */
      deleteReview: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((id: number) =>
            reviewService.delete(id).pipe(
              tapResponse({
                next: () => {
                  patchState(store, {
                    reviews: store.reviews().filter((r) => r.id !== id),
                  });
                  notificationStore.notifySuccess('NOTIFICATION.REVIEWS.DELETE_SUCCESS');
                },
                error: (err: HttpErrorResponse) => {
                  notificationStore.notifyError('NOTIFICATION.REVIEWS.DELETE_FAILED');
                  errorService.handle(err, 'ERROR DELETING REVIEW');
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
    })
  )
);
