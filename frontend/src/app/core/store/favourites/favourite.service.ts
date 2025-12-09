import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FavouriteJSON} from './model/favourite';

@Injectable({ providedIn: 'root' })
export class FavouriteService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/favourites';

  addFavourite(recipeId: number): Observable<FavouriteJSON> {
    return this.http.post<FavouriteJSON>(`${this.baseUrl}/${recipeId}`, {});
  }

  removeFavourite(recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${recipeId}`);
  }

  getUserFavourites(): Observable<FavouriteJSON[]> {
    return this.http.get<FavouriteJSON[]>(this.baseUrl);
  }
}
