import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {tapResponse} from '@ngrx/operators';
import {Recipe, RecipeJSON} from './model/recipe';
import {computed, inject} from '@angular/core';
import {RecipeService} from './recipe-service';
import {pipe, switchMap, tap} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {ApiError} from '../../model/api-error';
import {NotificationStore} from '../notification/notification.store';
import {ErrorService} from '../../errors/error.service';
import {Router} from '@angular/router';
import {UserStore} from '../authentication/user.store';
import {ImageJSON} from './model/ImageJSON';
import {Page, SimpleRecipe, SimpleRecipeJSON} from './model/simpleRecipe';

interface RecipeState {
  isLoading: boolean,
  isLoadingSearch: boolean,
  recipes: Recipe[],
  simpleRecipes: SimpleRecipe[],
  favourites: SimpleRecipe[],
  highest: SimpleRecipe[],
  page: number,
  isLastPage: boolean,
  isLoadingMore: boolean
}

export const initialState: RecipeState = {
  isLoading: false,
  isLoadingSearch: false,
  recipes: [],
  simpleRecipes: [],
  highest: [],
  favourites: [],
  page: 0,
  isLastPage: false,
  isLoadingMore: false
}

export const RecipeStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withComputed((store) => ({
    isRecipesEmpty: computed(() => {
      return (store.recipes().length === 0 && store.simpleRecipes().length === 0);
    })
  })),
  withMethods(
    (
      store,
      errorService = inject(ErrorService),
      recipeService = inject(RecipeService),
      router = inject(Router),
      notificationStore = inject(NotificationStore),
      userStore = inject(UserStore)
    ) => ({


      /**
       * Metodo Iniziale (Carica la prima pagina e resetta)
       **/
      loadRecipes: rxMethod<void>(
        pipe(
          tap(() => patchState(store, {isLoading: true, page: 0, isLastPage: false, simpleRecipes: []})),
          switchMap(() =>
            recipeService.getAllRecipes(0, 9).pipe(
              tapResponse({
                next: (pageData: Page<SimpleRecipeJSON>) => {
                  patchState(store, {
                    simpleRecipes: pageData.content.map(SimpleRecipe.fromJSON),
                    isLastPage: pageData.last,
                    page: 0
                  });
                },
                error: (err) => {
                },
                finalize: () => patchState(store, {isLoading: false})
              })
            )
          )
        )
      ),

      /**
       * Metodo "Carica Altro" (Append)
       **/
      loadMoreRecipes: rxMethod<void>(
        pipe(
          tap(() => patchState(store, {isLoadingMore: true})),
          switchMap(() => {
            const nextPage = store.page() + 1;
            return recipeService.getAllRecipes(nextPage, 9).pipe(
              tapResponse({
                next: (pageData: Page<SimpleRecipeJSON>) => {
                  const newRecipes = pageData.content.map(SimpleRecipe.fromJSON);
                  patchState(store, {
                    simpleRecipes: [...store.simpleRecipes(), ...newRecipes],
                    page: nextPage,
                    isLastPage: pageData.last
                  });
                },
                error: (err) => {
                },
                finalize: () => patchState(store, {isLoadingMore: false})
              })
            );
          })
        )
      ),
      /**
       * Metodo Iniziale (Carica la prima pagina e resetta)
       **/
      loadSearch: rxMethod<{ searchTerm: string; searchFilter: string }>(
        pipe(
          tap(() => patchState(store, {isLoading: true, page: 0, isLastPage: false, simpleRecipes: []})),
          switchMap(({searchTerm, searchFilter}) =>
            recipeService.searchPages(0, 9, searchTerm, searchFilter).pipe(
              tapResponse({
                next: (pageData: Page<SimpleRecipeJSON>) => {
                  patchState(store, {
                    simpleRecipes: pageData.content.map(SimpleRecipe.fromJSON),
                    isLastPage: pageData.last,
                    page: 0
                  });
                },
                error: (err) => {
                },
                finalize: () => patchState(store, {isLoading: false})
              })
            )
          )
        )
      ),

      /**
       * Metodo "Carica Altro" (Append)
       **/
      loadMoreSearch: rxMethod<{ searchTerm: string; searchFilter: string }>(
        pipe(
          tap(() => patchState(store, {isLoadingMore: true})),
          switchMap(({searchTerm, searchFilter}) => {
            const nextPage = store.page() + 1;
            return recipeService.searchPages(nextPage, 9, searchTerm, searchFilter).pipe(
              tapResponse({
                next: (pageData: Page<SimpleRecipeJSON>) => {
                  const newRecipes = pageData.content.map(SimpleRecipe.fromJSON);
                  patchState(store, {
                    simpleRecipes: [...store.simpleRecipes(), ...newRecipes],
                    page: nextPage,
                    isLastPage: pageData.last
                  });
                },
                error: (err) => {
                },
                finalize: () => patchState(store, {isLoadingMore: false})
              })
            );
          })
        )
      ),
      /** Metodo per recuperare tutte le ricette
       getAllRecipes: rxMethod<void> (
       pipe(
       tap(() => patchState(store,{isLoading: true})),
       switchMap(() =>
       recipeService.getAllSimples().pipe(
       tapResponse({
       next: (recipesJSON: SimpleRecipeJSON[]): void => {
       patchState(store, {simpleRecipes: recipesJSON.map((recipesJSON: SimpleRecipeJSON) => SimpleRecipe.fromJSON(recipesJSON))});
       },
       error: (err: HttpErrorResponse) => {
       if(err.error) {
       let apiError: ApiError = err.error;
       notificationStore.notifyError(`ERROR.RECIPES.LOADING_RECIPES: ${apiError.code}`);
       } else {
       notificationStore.notifyError(`ERROR LOADING RECIPES`);
       }
       errorService.handle(err, 'ERROR LOADING RECIPES');
       },
       finalize: () => {
       patchState(store, {isLoading: false});
       }
       }),
       //            catchError(err => of(null))
       ))
       )
       ),

       /** Metodo per recuperare una ricetta tramite id */
      getRecipeById: rxMethod<number>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap((id: number) =>
            recipeService.getRecipeById(id).pipe(
              tapResponse({
                next: (recipeJSON: RecipeJSON) => {
                  const recipe = Recipe.fromJSON(recipeJSON);
                  patchState(store, {recipes: [recipe]});
                },
                error: (err: HttpErrorResponse) => {
                  notificationStore.notifyError('NOTIFICATION.RECIPE.ID_ERROR');
                  errorService.handle(err, 'ERROR LOADING SINGLE RECIPE');
                },
                finalize: () => patchState(store, {isLoading: false})
              })
            )
          )
        )
      ),
      /** Metodo per postare una ricetta */
      addRecipe: rxMethod<Recipe>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap((recipe: Recipe) =>
            recipeService.postRecipe(Recipe.toJSON(recipe)).pipe(
              tapResponse({
                next: (createdRecipeJSON: RecipeJSON): void => {
                  const createdRecipe = Recipe.fromJSON(createdRecipeJSON);
                  patchState(store, {recipes: [...store.recipes(), createdRecipe]});
                  notificationStore.notifySuccess('NOTIFICATION.RECIPE.POST_SUCCESS');
                  window.location.href = `/recipes/uploadImage/${createdRecipe.id}`;

                },
                error: (err: HttpErrorResponse) => {
                  if (err.error) {
                    const apiError: ApiError = err.error;
                    notificationStore.notifyError('NOTIFICATION.RECIPE.POST_FAILED');
                  } else {
                    notificationStore.notifyError(`NOTIFICATION.RECIPE.POST_FAILED`);
                  }
                  errorService.handle(err, 'ERROR ADDING RECIPE');
                },
                finalize: () => patchState(store, {isLoading: false})
              })
            )
          )
        )
      ),

      /** Metodo per recuperare le 5 ricette migliori per rating medio */
      getHighestRecipes: rxMethod<void>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap(() =>
            recipeService.getHighestRecipes().pipe(
              tapResponse({
                next: (recipesJSON: SimpleRecipeJSON[]): void => {
                  patchState(store, {highest: recipesJSON.map((recipesJSON: SimpleRecipeJSON) => SimpleRecipe.fromJSON(recipesJSON))});
                },
                error: (err: HttpErrorResponse) => {
                  notificationStore.notifyError(`ERROR LOADING RECIPES WITH THE HIGHEST RATINGS`);
                  errorService.handle(err, 'ERROR LOADING RECIPES WITH THE HIGHEST RATINGS');
                },
                finalize: () => {
                  patchState(store, {isLoading: false});
                }
              }),
//            catchError(err => of(null))
            ))
        )
      ),
      /** Metodo per recuperare le migliori 5 ricette per likes */
      getMostFavouritedRecipes: rxMethod<void>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap(() =>
            recipeService.getMostFavouritedRecipes().pipe(
              tapResponse({
                next: (recipesJSON: SimpleRecipeJSON[]): void => {
                  patchState(store, {favourites: recipesJSON.map((recipesJSON: SimpleRecipeJSON) => SimpleRecipe.fromJSON(recipesJSON))});
                },
                error: (err: HttpErrorResponse) => {
                  notificationStore.notifyError(`ERROR LOADING THE MOST FAVOURITED RECIPES`);
                  errorService.handle(err, 'ERROR LOADING THE MOST FAVOURITED RECIPES');
                },
                finalize: () => {
                  patchState(store, {isLoading: false});
                }
              }),
//            catchError(err => of(null))
            ))
        )
      ),

      /** Metodo per eliminare una ricetta tramite id */
      deleteRecipe: rxMethod<number>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap((id: number) =>
            recipeService.deleteRecipe(id).pipe(
              tapResponse({
                next: () => {
                  // rimuovi la ricetta dallo stato
                  patchState(store, {
                    recipes: store.recipes().filter(r => r.id !== id)
                  });
                  notificationStore.notifySuccess('NOTIFICATION.RECIPE.DELETE_SUCCESS');
                },
                error: (err: HttpErrorResponse) => {
                  notificationStore.notifyError('NOTIFICATION.RECIPE.DELETE_FAILED');
                  errorService.handle(err, 'ERROR DELETING RECIPE');
                },
                finalize: () => patchState(store, {isLoading: false})
              })
            )
          )
        )
      ),
      /** Metodo per aggiornare una ricetta */
      updateRecipe: rxMethod<Recipe>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap((recipe: Recipe) =>
              recipeService.updateRecipe(recipe.id!, Recipe.toJSON(recipe)).pipe(
                tapResponse({
                  next: (updatedRecipeJSON: RecipeJSON) => {
                    const updatedRecipe = Recipe.fromJSON(updatedRecipeJSON);

                    patchState(store, {
                      recipes: store.recipes().map(r =>
                        r.id === updatedRecipe.id ? updatedRecipe : r
                      )
                    });

                    notificationStore.notifySuccess('NOTIFICATION.RECIPE.EDIT_SUCCESS');
//                  router.navigateByUrl(`/recipes/${updatedRecipe.id}`);
//                  window.location.href = `/recipes/${updatedRecipe.id}`;
                    window.location.href = `/recipes/uploadImage/${updatedRecipe.id}`;


                  },
                  error: (err: HttpErrorResponse) => {
                    notificationStore.notifyError('NOTIFICATION.RECIPE.EDIT_FAILED');
                    errorService.handle(err, 'ERROR UPDATING RECIPE');
                  },
                  finalize: () => patchState(store, {isLoading: false})
                })
              )
          )
        )
      ),
      /** Metodo per postare un'immagine per una ricetta */
      uploadImageToRecipe: rxMethod<{ recipeId: number, file: File }>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap(({recipeId, file}) =>
            recipeService.uploadRecipeImage(recipeId, file).pipe(
              tapResponse({
                next: (uploadedImage: ImageJSON): void => {
                  const recipeToUpdate = store.recipes().find(r => r.id === recipeId);

                  if (recipeToUpdate) {
                    const updatedImages = [...(recipeToUpdate.images || []), uploadedImage];
                    patchState(store, {
                      recipes: store.recipes().map(r =>
                        r.id === recipeId
                          ? Recipe.fromJSON({...Recipe.toJSON(r), images: updatedImages})
                          : r
                      )
                    });
                    notificationStore.notifySuccess('NOTIFICATION.RECIPE.UPLOAD_IMAGE_SUCCESS');
                  }
                },
                error: (err: HttpErrorResponse) => {
                  notificationStore.notifyError('NOTIFICATION.RECIPE.UPLOAD_IMAGE_FAILED');
                  errorService.handle(err, 'ERROR UPLOADING RECIPE IMAGE');
                },
                finalize: () => patchState(store, {isLoading: false})
              })
            )
          )
        )
      ),
      /** Metodo per eliminare un'immagine di una ricetta */
      deleteImageFromRecipe: rxMethod<{ recipeId: number, imageId: number }>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap(({recipeId, imageId}) =>
            recipeService.deleteImage(recipeId, imageId).pipe(
              tapResponse({
                next: () => {
                  patchState(store, {
                    recipes: store.recipes().map(r =>
                      r.id === recipeId
                        ? Recipe.fromJSON({
                          ...Recipe.toJSON(r), images: r.images?.filter(
                            i => i.id !== imageId) ?? []
                        })
                        : r
                    )
                  });
                  notificationStore.notifySuccess('NOTIFICATION.RECIPE.DELETE_IMAGE_SUCCESS');
                },
                error: (err: HttpErrorResponse) => {
                  notificationStore.notifyError('NOTIFICATION.RECIPE.DELETE_IMAGE_FAILED');
                  errorService.handle(err, 'ERROR DELETING IMAGE');
                },
                finalize: () => patchState(store, {isLoading: false})
              })
            )
          )
        )
      ),


      isMyRecipe(recipeId: number): boolean {
        const recipe = store.recipes().find(r => r.id === recipeId);
        const currentUser = userStore.getUsername();
        return recipe?.author?.username === currentUser;
      }


    })
  )
);


