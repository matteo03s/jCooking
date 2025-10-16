import {Component, inject, Input, OnInit, resource, signal} from '@angular/core';
import {Recipe} from '../../../model/recipe';
import {Level} from '../../../model/enums';
import {SingularRecipe} from './singular-recipe/singular-recipe';
import {RecipeService} from './serivces/recipe-service';
import {map} from 'rxjs';

@Component({
  selector: 'app-recipes',
  imports: [
    SingularRecipe
  ],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
  standalone: true
})

export default class Recipes {
  recipeService = inject(RecipeService);
  recipes = this.recipeService.load();
  recipesCount$ = this.recipes.pipe(map(list => list.length));

  /*  recipes$ = signal<Recipe[]>([])
  ngOnInit(): void {
    this.recipeService.load()
      .subscribe({
        next: res => {
          this.recipes.set(res)
        }
      })
  }
*/


  recipeId = signal(1)
  recipeResource = resource <Recipe, number> ({
    params: () => this.recipeId(),
    loader: async({params : id}) => {
      const res = await fetch (`http://localhost:8080/recipes/${id}`)
      return await res.json()
    }
  })




  recipesResource = resource<Recipe[], void>({
    loader: async () => {
      const res = await fetch("http://localhost:8080/recipes");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    }
  });

  nextRecipe () {
    this.recipeId.update( id => {
      return id < this.recipesResource.value.length ? id + 1 : 1
    })
  }
}
