import {Component, inject, OnInit} from '@angular/core';
import {FavouriteStore} from '../../core/store/favourites/favourite.store';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-my-favourites',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './my-favourites.html',
  styleUrl: './my-favourites.scss'
})
export default class MyFavourites implements OnInit {
  favouriteStore = inject(FavouriteStore);
  router = inject(Router);

  ngOnInit() {
    this.favouriteStore.loadUserFavourites();
  }

  remove(recipeId: number) {
    this.favouriteStore.removeFavourite(recipeId);
  }

  goToRecipe (recipeId: number) {
    this.router.navigateByUrl(`recipes/${recipeId}`);
  }
}
