import {CommonModule} from '@angular/common';
import RecipeForm from './recipe-form';
import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RecipeStore} from '../../core/store/recipe/recipe.store';

@Component({
  selector: 'app-recipe-edit',
  standalone: true,
  imports: [CommonModule, RecipeForm],
  template: `
    <div class="container mt-4">
      @if (recipe()) {
      <app-recipe-form [recipe]="recipe()"></app-recipe-form>
      }
    </div>
  `
})
export default class RecipeEditComponent {
  recipeStore = inject(RecipeStore);
  route = inject(ActivatedRoute);

  recipe = computed(() => {
    const id = +this.route.snapshot.paramMap.get('id')!;
    return this.recipeStore.recipes().find(r => r.id === id);
  });
}
