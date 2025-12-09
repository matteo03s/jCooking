import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FavouriteStore} from '../../store/favourites/favourite.store';

@Component({
  selector: 'app-favourite-button',
  imports: [],
  templateUrl: './favourite-button.html',
  standalone: true,
  styleUrl: './favourite-button.scss'
})
export class FavouriteButton {

  private favouriteStore = inject(FavouriteStore);

  @Input() recipeId!: number;
  @Output() favouriteChanged = new EventEmitter<boolean>();

  isFavourite(): boolean {
    return this.favouriteStore.isFavourite(this.recipeId);
  }

  toggleFavourite(): void {
    if (this.isFavourite()) {
      this.favouriteStore.removeFavourite(this.recipeId);
      this.favouriteChanged.emit(false);
    } else {
      this.favouriteStore.addFavourite(this.recipeId);
      this.favouriteChanged.emit(true);
    }
  }
}
