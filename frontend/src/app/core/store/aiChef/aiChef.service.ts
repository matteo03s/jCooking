import {Observable} from 'rxjs';
import {RecipeJSON} from '../recipe/model/recipe';
import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AiSommelierResponse} from './ai-beverage';
import {AiNutrition} from './aiNutrition';
import {AiStepsResponse, AiTagsResponse} from './ai-tags';
import {AiTranslatedRecipe} from './model/ai-translated-recipe';

@Injectable({ providedIn: 'root' })
export class AiChefService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/ai'

  generateRecipe(ingredients: string, type: string): Observable<RecipeJSON> {
    const params = new HttpParams()
      .set('ingredients', ingredients)
      .set('type', type);

    return this.http.get<RecipeJSON>(`${this.baseUrl}/generate`, { params });
  }

  getBeverageRecommendations(title: string, ingredients: string, category: string): Observable<AiSommelierResponse> {
    const params = new HttpParams()
      .set('title', title)
      .set('ingredients', ingredients)
      .set('category', category);

    return this.http.get<AiSommelierResponse>(`${this.baseUrl}/sommelier`, { params });
  }

  analyzeNutrition(title: string, ingredients: string, servings: number): Observable<AiNutrition> {
    const params = new HttpParams()
      .set('title', title)
      .set('ingredients', ingredients)
      .set('servings', servings.toString());

    return this.http.get<AiNutrition>(`${this.baseUrl}/nutrition`, { params });
  }

  generateDescription(title: string, ingredients: string): Observable<{ description: string }> {
    const params = new HttpParams()
      .set('title', title)
      .set('ingredients', ingredients);
    return this.http.get<{ description: string }>(`${this.baseUrl}/description`, { params });
  }
  generateTags(title: string, ingredients: string): Observable<AiTagsResponse> {
    const params = new HttpParams()
      .set('title', title)
      .set('ingredients', ingredients);
    return this.http.get<AiTagsResponse>(`${this.baseUrl}/tags`, { params });
  }
  generateSteps(title: string, ingredients: string): Observable<AiStepsResponse> {
    const params = new HttpParams()
      .set('title', title)
      .set('ingredients', ingredients);
    return this.http.get<AiStepsResponse>(`${this.baseUrl}/steps`, { params });
  }

  translateRecipe(recipeData: any, language: string): Observable<AiTranslatedRecipe> {
    const params = new HttpParams().set('language', language);

    const body = {
      title: recipeData.title,
      description: recipeData.description,
      ingredients: recipeData.ingredients.map((i: any) => ({
        name: i.name,
        quantity: i.quantity ?? null,
        unit: i.unit
      })),

      steps: recipeData.steps
    };

    return this.http.post<AiTranslatedRecipe>(`${this.baseUrl}/translate`, body, { params });
  }

}
