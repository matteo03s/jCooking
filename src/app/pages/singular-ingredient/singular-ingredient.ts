import {Component, Input} from '@angular/core';
import { Ingredient } from "../../../model/ingredient";

@Component({
  selector: 'app-singular-ingredient',
  imports: [],
  templateUrl: './singular-ingredient.html',
  styleUrl: './singular-ingredient.scss'
})
export class SingularIngredient {
  @Input() ingredient: Ingredient | undefined;

}
