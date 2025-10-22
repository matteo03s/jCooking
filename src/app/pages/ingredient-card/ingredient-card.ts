import {Component, Input} from '@angular/core';
import { Ingredient } from "../../core/model/ingredient";

@Component({
  selector: 'app-singular-ingredient',
  imports: [],
  templateUrl: './ingredient-card.html',
  styleUrl: './ingredient-card.scss'
})
export class SingularIngredient {
  @Input() ingredient: Ingredient | undefined;

}
