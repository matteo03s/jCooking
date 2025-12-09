import {Component, inject, OnInit} from '@angular/core';
import {RecipeSemplified} from '../../recipes/recipe-semplified/recipe-semplified';
import SpinnerComponent from '../../../core/components/spinner/spinner';
import {RecipeStore} from '../../../core/store/recipe/recipe.store';
import {CarouselComponent} from '../../../core/components/carousel-component/carousel-component';
import {AiFieldsGeneratorButton} from '../../../core/components/ai-fields-generator-button/ai-fields-generator-button';
import {SimpleRecipeCard} from '../../recipes/simple-recipe-card/simple-recipe-card';

@Component({
  selector: 'app-top-favourite',
  imports: [
    CarouselComponent,
    SimpleRecipeCard
  ],
  templateUrl: './top-favourite.html',
  standalone: true,
  styleUrl: './top-favourite.scss'
})
export class TopFavourite implements OnInit {
  recipeStore = inject(RecipeStore);

  ngOnInit(): void {
    this.recipeStore.getMostFavouritedRecipes();
  }
  recipes = this.recipeStore.favourites;

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
