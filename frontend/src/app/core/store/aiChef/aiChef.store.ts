import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Recipe, RecipeJSON } from '../recipe/model/recipe';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationStore } from '../notification/notification.store';
import {AiChefService} from './aiChef.service';
import {AiBeverage, AiSommelierResponse} from './ai-beverage';
import {AiNutrition} from './aiNutrition';
import {AiTranslatedRecipe} from './model/ai-translated-recipe';

interface AiChefState {
  isGenerating: boolean;
  draftRecipe: Recipe | null;
  isSommelierLoading: boolean;
  beverageRecommendations: AiBeverage[];
  isNutritionLoading: boolean;
  nutritionInfo: AiNutrition | null;
  isGeneratingDescription: boolean;
  generatedDescriptionText: string | null;
  isGeneratingTags: boolean;
  generatedTags: string[];
  isGeneratingSteps: boolean;
  generatedSteps: string[];
  isTranslating: boolean;
  translatedData: AiTranslatedRecipe | null;
}

const initialState: AiChefState = {
  isGenerating: false,
  draftRecipe: null,
  isSommelierLoading: false,
  beverageRecommendations: [],
  isNutritionLoading: false,
  nutritionInfo: null,
  isGeneratingDescription: false,
  generatedDescriptionText: null,
  isGeneratingTags: false,
  generatedTags: [],
  isGeneratingSteps: false,
  generatedSteps: [],
  isTranslating: false,
  translatedData: null,
};

export const AiChefStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((
    store,
    aiService = inject(AiChefService),
    notificationStore = inject(NotificationStore)
  ) => ({

    // Metodo per generare ricetta
    generateRecipe: rxMethod<{ ingredients: string, type: string }>(
      pipe(
        tap(() => patchState(store, { isGenerating: true, draftRecipe: null })),
        switchMap(({ ingredients, type }) =>
          aiService.generateRecipe(ingredients, type).pipe(
            tapResponse({
              next: (json: RecipeJSON) => {
                const recipe = Recipe.fromJSON(json);
                patchState(store, { draftRecipe: recipe });
                notificationStore.notifySuccess('NOTIFICATION.CHEFBOT.RECIPE_SUCCESS');
              },
              error: (err: HttpErrorResponse) => {
                notificationStore.notifyError('NOTIFICATION.CHEFBOT.RECIPE_FAILED');
              },
              finalize: () => patchState(store, { isGenerating: false })
            })
          )
        )
      )
    ),

    //generazione consigli bevande
    askSommelier: rxMethod<{ title: string, ingredients: string, category: string }>(
      pipe(
        tap(() => patchState(store, { isSommelierLoading: true, beverageRecommendations: [] })), // Reset
        switchMap((params) =>
          aiService.getBeverageRecommendations(params.title, params.ingredients, params.category).pipe(
            tapResponse({
              next: (res: AiSommelierResponse) => {
                console.log(params.title)
                console.log(params.ingredients)
                console.log(params.category)
                patchState(store, { beverageRecommendations: res.beverages });
                notificationStore.notifySuccess('NOTIFICATION.CHEFBOT.SOMMELIER_SUCCESS');
              },
              error: (err: HttpErrorResponse) => {
                notificationStore.notifyError('NOTIFICATION.CHEFBOT.SOMMELIER_FAILED');
              },
              finalize: () => patchState(store, { isSommelierLoading: false })
            })
          )
        )
      )
    ),

    //calcolo valori nutrizionali
    analyzeNutrition: rxMethod<{ title: string, ingredients: string, servings: number }>(
      pipe(
        tap(() => patchState(store, { isNutritionLoading: true, nutritionInfo: null })),
        switchMap((params) =>
          aiService.analyzeNutrition(params.title, params.ingredients, params.servings).pipe(
            tapResponse({
              next: (info: AiNutrition) => {
                patchState(store, { nutritionInfo: info });
                notificationStore.notifySuccess('NOTIFICATION.CHEFBOT.NUTRITION_SUCCESS');
              },
              error: (err: HttpErrorResponse) => {
                notificationStore.notifyError('NOTIFICATION.CHEFBOT.NUTRITION_FAILED');
              },
              finalize: () => patchState(store, { isNutritionLoading: false })
            })
          )
        )
      )
    ),

    //generazione della descrizione di una ricetta
    generateDescriptionOnly: rxMethod<{ title: string, ingredients: string }>(
      pipe(
        tap(() => patchState(store, { isGeneratingDescription: true, generatedDescriptionText: null })),
        switchMap(({ title, ingredients }) =>
          aiService.generateDescription(title, ingredients).pipe(
            tapResponse({
              next: (res) => {
                patchState(store, { generatedDescriptionText: res.description });
                notificationStore.notifySuccess('️NOTIFICATION.CHEFBOT.DESCRIPTION_SUCCESS');
              },
              error: (err) => notificationStore.notifyError('NOTIFICATION.CHEFBOT.DESCRIPTION_FAILED'),
              finalize: () => patchState(store, { isGeneratingDescription: false })
            })
          )
        )
      )
    ),

    //generazione dei tags di una ricetta
    generateTagsOnly: rxMethod<{ title: string, ingredients: string }>(
      pipe(
        tap(() => patchState(store, { isGeneratingTags: true, generatedTags: [] })),
        switchMap(({ title, ingredients }) =>
          aiService.generateTags(title, ingredients).pipe(
            tapResponse({
              next: (res) => {
                patchState(store, { generatedTags: res.tags });
                notificationStore.notifySuccess('NOTIFICATION.CHEFBOT.TAG_SUCCESS️');
              },
              error: (err) => notificationStore.notifyError('NOTIFICATION.CHEFBOT.TAG_FAILED'),
              finalize: () => patchState(store, { isGeneratingTags: false })
            })
          )
        )
      )
    ),

    //generazione degli steps di una ricetta
    generateStepsOnly: rxMethod<{ title: string, ingredients: string }>(
      pipe(
        tap(() => patchState(store, { isGeneratingSteps: true, generatedSteps: [] })),
        switchMap(({ title, ingredients }) =>
          aiService.generateSteps(title, ingredients).pipe(
            tapResponse({
              next: (res) => {
                patchState(store, { generatedSteps: res.steps });
                notificationStore.notifySuccess('NOTIFICATION.CHEFBOT.STEPS_SUCCESS');
              },
              error: (err) => notificationStore.notifyError('NOTIFICATION.CHEFBOT.STEPS_FAILED'),
              finalize: () => patchState(store, { isGeneratingSteps: false })
            })
          )
        )
      )
    ),

    translateRecipe: rxMethod<{ recipe: any, language: string }>(
      pipe(
        tap(() => patchState(store, { isTranslating: true })),
        switchMap(({ recipe, language }) =>
          aiService.translateRecipe(recipe, language).pipe(
            tapResponse({
              next: (res) => {
                patchState(store, { translatedData: res });
//                notificationStore.notifySuccess(`Traduzione in ${language} completata! 🌍`);
                notificationStore.notifySuccess('NOTIFICATION.CHEFBOT.TRANSLATE_SUCCESS');
              },
              error: (err) => notificationStore.notifyError('NOTIFICATION.CHEFBOT.TRANSLATE_FAILED'),
              finalize: () => patchState(store, { isTranslating: false })
            })
          )
        )
      )
    ),

    clearTranslation: () => patchState(store, { translatedData: null }),


    clearDraft: () => {
      patchState(store, { draftRecipe: null });
    },

    clearSommelier: () => {
      patchState(store, { beverageRecommendations: [] });
    },

    clearNutrition: () => {
      patchState(store, { nutritionInfo: null });
    },

    clearDescriptionText: () => {
      patchState(store, { generatedDescriptionText: null });
    },
  }))
);
