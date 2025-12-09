import {Component, inject, OnInit} from '@angular/core';
import {RecipeStore} from '../../../core/store/recipe/recipe.store';
import SpinnerComponent from '../../../core/components/spinner/spinner';
import {RecipeSemplified} from '../../recipes/recipe-semplified/recipe-semplified';
import {CarouselComponent} from '../../../core/components/carousel-component/carousel-component';
import {SimpleRecipeCard} from '../../recipes/simple-recipe-card/simple-recipe-card';

@Component({
  selector: 'app-highest-ratings',
  imports: [
    SpinnerComponent,
    RecipeSemplified,
    CarouselComponent,
    SimpleRecipeCard
  ],
  templateUrl: './highest-ratings.html',
  standalone: true,
  styleUrl: './highest-ratings.scss'
})
export class HighestRatings implements OnInit {
  recipeStore = inject(RecipeStore);

  ngOnInit(): void {
    this.recipeStore.getHighestRecipes();
  }
  recipes = this.recipeStore.highest;

  chunkedRecipes() {
    const itemsPerSlide = 2;
    const result = [];
    const list = this.recipes();

    for (let i = 0; i < list.length; i += itemsPerSlide) {
      result.push(list.slice(i, i + itemsPerSlide));
    }

    return result;
  }

}
