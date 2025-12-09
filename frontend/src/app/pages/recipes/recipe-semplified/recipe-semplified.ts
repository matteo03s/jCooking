import {Component, computed, inject, Input} from '@angular/core';
import {Recipe} from '../../../core/store/recipe/model/recipe';
import {DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FavouriteButton} from '../../../core/components/favourite-button/favourite-button';
import {FavouriteStore} from '../../../core/store/favourites/favourite.store';
import {BsModalService} from 'ngx-bootstrap/modal';
import {RecipeStore} from '../../../core/store/recipe/recipe.store';
import {SimpleRecipe} from '../../../core/store/recipe/model/simpleRecipe';
import {ConfirmModalComponent} from '../../../core/components/modal-component/modal-component';

@Component({
  selector: 'app-recipe-semplified',
  imports: [
    DecimalPipe,
    RouterLink,
    FavouriteButton
  ],
  templateUrl: './recipe-semplified.html',
  standalone: true,
  styleUrls: [
    './recipe-semplified.scss',
    '../recipe-card/recipe-card.scss',
    '../../recipes/details.scss',
  ]
})
export class RecipeSemplified {
constructor(private modalService: BsModalService) {}
  recipeStore = inject(RecipeStore);
  favouriteStore = inject(FavouriteStore);

  @Input() recipe: SimpleRecipe | undefined;
  @Input() removable: boolean = false;

  recipeImage = computed(() => {
    if (this.recipe != undefined) {
      console.log(this.recipe)
      console.log(this.recipe?.firstImageUrl)
      return this.recipe?.firstImageUrl ?? null
    } else {
      return null
    }
  });


  toggleFavourite(): void {
    if (this.isFavourite()) {
      this.favouriteStore.removeFavourite(this.recipe?.id!);
    } else {
      this.favouriteStore.addFavourite(this.recipe?.id!);
    }
  }

  isFavourite(): boolean {
    return this.favouriteStore.isFavourite(this.recipe?.id!);
  }
  onFavouriteChanged(isFav: boolean) {
    console.log('Favourite state changed:', isFav);
  }
  openModal(recipeId: number) {
    const modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'Elimina ricetta',
        message: 'Sei sicuro di voler eliminare questa ricetta?'
      },
      backdrop: 'static',
      class: 'modal-md'
    });

    modalRef.content?.confirm.subscribe(() => {
      this.recipeStore.deleteRecipe(recipeId);
    });
  }
}
