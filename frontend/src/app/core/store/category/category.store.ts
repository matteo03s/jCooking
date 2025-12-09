import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {computed, inject} from '@angular/core';
import {ErrorService} from '../../errors/error.service';
import {NotificationStore} from '../notification/notification.store';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../model/api-error';
import {Category, CategoryJSON} from './category';
import {CategoryService} from './category.service';

interface CategoryState {
  isLoading: boolean,
  isLoadingSearch: boolean,
  categories: Category[],
}

export const initialState: CategoryState = {
  isLoading: false,
  isLoadingSearch: false,
  categories: [],
}

export const CategoryStore = signalStore (
  {providedIn: 'root'},
  withState(initialState),
  withComputed ((store) => ({
    isCategoriesEmpty: computed(() => {
      return store.categories().length === 0;
    })
  })),
  withMethods (
    (
      store,
      errorService = inject(ErrorService),
      categoryService = inject(CategoryService),
      notificationStore = inject(NotificationStore),
    ) => ({
      getAllCategories: rxMethod<void> (
        pipe(
          tap(() => patchState(store,{isLoading: true})),
          switchMap(() =>
            categoryService.getAllCategories().pipe(
              tapResponse({
                next: (categoriesJSON: CategoryJSON[]): void => {
                  patchState(store, {categories: categoriesJSON.map((categoriesJSON: CategoryJSON) => Category.fromJSON(categoriesJSON))});
                },
                error: (err: HttpErrorResponse) => {
                  if(err.error) {
                    let apiError: ApiError = err.error;
                    notificationStore.notifyError(`ERROR.CATEGORIES.LOADING_CATEGORIES: ${apiError.code}`);
                  } else {
                    notificationStore.notifyError(`ERROR LOADING CATEGORIES`);
                  }
                  errorService.handle(err, 'ERROR LOADING CATEGORIES');
                },
                finalize: () => {
                  patchState(store, {isLoading: false});
                }
              }),
//            catchError(err => of(null))
            ))
        )
      ),

    })
  )
);
