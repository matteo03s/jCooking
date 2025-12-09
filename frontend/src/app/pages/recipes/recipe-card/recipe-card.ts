import {Component, computed, inject, input, Input, signal} from '@angular/core';
import {Recipe} from '../../../core/store/recipe/model/recipe';
import {RouterLink} from '@angular/router';
import {RecipeStore} from '../../../core/store/recipe/recipe.store';
import {DecimalPipe} from '@angular/common';
import {FavouriteStore} from '../../../core/store/favourites/favourite.store';
import {FavouriteButton} from '../../../core/components/favourite-button/favourite-button';

import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ConfirmModalComponent} from '../../../core/components/modal-component/modal-component';

@Component({
  selector: 'app-recipe-card',
  imports: [
    RouterLink,
    DecimalPipe,
    FavouriteButton
  ],
  templateUrl: './recipe-card.html',
  standalone: true,
  styleUrls: [
    './recipe-card.scss',
    '../details.scss'
  ]
})
export class RecipeCard {
  constructor(private modalService: BsModalService) {}
  recipeStore = inject(RecipeStore);
  favouriteStore = inject(FavouriteStore);

  @Input() recipe: Recipe | undefined;
  @Input() removable: boolean = false;

  recipeImage = computed(() => {
    if (this.recipe != undefined) {
      console.log(this.recipe)
      console.log(this.recipe?.images)
      console.log(this.recipe?.images?.[0])
      return this.recipe?.images?.[0] ?? null
    } else {
      return null
    }
  });

  // computed: calcola automaticamente ore e minuti
  equivalentValue = computed(() => {
    const total = (this.recipe?.prepTime ?? 0) + (this.recipe?.cookTime ?? 0);
    const hours = Math.floor(total! / 60);
    const mins = total! % 60;
    const pad = (v: number) => v.toString().padStart(2, '0');
    return `${pad(hours)}h ${pad(mins)}min`;
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
  protected readonly signal = signal;

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
