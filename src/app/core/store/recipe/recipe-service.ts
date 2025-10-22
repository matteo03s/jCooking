import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../../../core/store/recipe/model/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  http = inject(HttpClient);

  load() {
    return this.http.get<Recipe[]>( `http://localhost:8080/recipes `)
  }

}
