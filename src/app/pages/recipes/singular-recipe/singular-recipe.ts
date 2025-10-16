import {Component, Input, signal} from '@angular/core';
import {Recipe} from '../../../../model/recipe';

@Component({
  selector: 'app-singular-recipe',
  imports: [],
  templateUrl: './singular-recipe.html',
  styleUrl: './singular-recipe.scss'
})
export class SingularRecipe {
  @Input() recipe: Recipe | undefined;

}
