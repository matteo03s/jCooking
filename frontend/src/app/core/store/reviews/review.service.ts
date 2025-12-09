import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Review, ReviewJSON } from './model/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `http://localhost:8080/reviews`;

  /**
   * GET tutte le recensioni
   */
  getAll(): Observable<ReviewJSON[]> {
    return this.http.get<ReviewJSON[]>(this.baseUrl)
  }

  /**
   * GET recensioni per una specifica ricetta
   */
  getByRecipe(recipeId: number): Observable<ReviewJSON[]> {
    return this.http.get<ReviewJSON[]>(`${this.baseUrl}/recipe/${recipeId}`)
  }

  /**
   * GET recensioni per utente
   */
  getByUser(username: string): Observable<ReviewJSON[]> {
    return this.http.get<ReviewJSON[]>(`${this.baseUrl}/user/${username}`)
  }

  /**
   * POST (crea) una nuova recensione
   */
  create(review: ReviewJSON, recipeId: number): Observable<ReviewJSON> {
    return this.http.post<ReviewJSON>(
      `${this.baseUrl}?recipeId=${recipeId}`,
      review
    )
  }

  /**
   * DELETE recensione
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
