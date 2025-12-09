import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RecipeJSON} from './model/recipe';
import {Observable} from 'rxjs';
import {ImageJSON} from './model/ImageJSON';
import {Page, SimpleRecipeJSON} from './model/simpleRecipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/recipes'

  getAllSimples() {
    return this.http.get<SimpleRecipeJSON[]>(`${this.baseUrl}`)
  }

  getRecipeById(id: number) {
    return this.http.get<RecipeJSON>(`${this.baseUrl}/${id}`)
  }

  searchRecipes (searchTerm: string, searchFilter: string): Observable<SimpleRecipeJSON[]> {
    const params = new HttpParams()
      .set('term', searchTerm)
      .set('filter', searchFilter);

    return this.http.get<SimpleRecipeJSON[]>(`${this.baseUrl}/search`, { params });
  }

  postRecipe(recipe: RecipeJSON) {
    return this.http.post<RecipeJSON>(this.baseUrl, recipe);
  }

  getRecipesByTag(tag: string) {
    return this.http.get<SimpleRecipeJSON[]>(`${this.baseUrl}/tag/${tag}`);
  }

  getRecipesByLevel(level: string) {
    return this.http.get<SimpleRecipeJSON[]>(`${this.baseUrl}/level/${level}`);
  }

  getRecipesByCategory(category: string) {
    return this.http.get<SimpleRecipeJSON[]>(`${this.baseUrl}/category/${category}`);
  }

  getRecipesByUser(username: string) {
    return this.http.get<SimpleRecipeJSON[]>(`${this.baseUrl}/user/${username}`);
  }

  getHighestRecipes() {
    return this.http.get<SimpleRecipeJSON[]>(`${this.baseUrl}/highest`)
  }

  getMostFavouritedRecipes() {
    return this.http.get<SimpleRecipeJSON[]>(`${this.baseUrl}/favourites`)
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateRecipe(id: number, recipe: RecipeJSON): Observable<RecipeJSON> {
    return this.http.put<RecipeJSON>(`${this.baseUrl}/${id}`, recipe);
  }

  uploadRecipeImage(recipeId: number, file: File): Observable<ImageJSON> {
    const formData = new FormData();
    // 'file' deve corrispondere al parametro @RequestParam("file") del tuo controller Spring Boot
    formData.append('file', file, file.name);
    return this.http.post<ImageJSON>(
      `${this.baseUrl}/${recipeId}/images`,
      formData
    );
  }

  deleteImage(recipeId: number, imageId: number): Observable<void> {
    return this.http.delete<void> (`${this.baseUrl}/${recipeId}/images/${imageId}`);
  }

  getAllRecipes(page: number = 0, size: number = 10): Observable<Page<SimpleRecipeJSON>> {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<SimpleRecipeJSON>>(`${this.baseUrl}`, { params });
  }
  searchPages (page: number = 0, size: number = 10, searchTerm: string, searchFilter: string): Observable<Page<SimpleRecipeJSON>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('term', searchTerm)
      .set('filter', searchFilter);

    return this.http.get<Page<SimpleRecipeJSON>>(`${this.baseUrl}/search`, { params });
  }
}
