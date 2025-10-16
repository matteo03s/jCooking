import {Component, resource, signal} from '@angular/core';
import {Ingredient} from '../../../model/ingredient';
import {SingularRecipe} from '../recipes/singular-recipe/singular-recipe';
import {SingularIngredient} from '../singular-ingredient/singular-ingredient';

@Component({
  selector: 'app-ingredients',
  imports: [
    SingularRecipe,
    SingularIngredient
  ],
  templateUrl: './ingredients.html',
  styleUrl: './ingredients.scss'
})
export default class Ingredients {
  ingredientId = signal(1)
  ingredientResourse = resource <Ingredient, number> ({
    params: () => this.ingredientId(),
    loader: async({params : id}) => {
      const res = await fetch (`http://localhost:8080/ingredients/${id}`)
      return await res.json()
    }
  })

  nextIngredient () {
    this.ingredientId.update( id => {
      return id < 2 ? id + 1 : 1
    })
  }

  ingredientsResource = resource<Ingredient[], void>({
    loader: async () => {
      const res = await fetch("http://localhost:8080/ingredients");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    }
  });

}
