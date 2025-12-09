import {Component, inject, OnInit} from '@angular/core';

import {RecipeCard} from './recipe-card/recipe-card';
import {RecipeStore} from '../../core/store/recipe/recipe.store';
import SpinnerComponent from '../../core/components/spinner/spinner';
import {ActivatedRoute} from '@angular/router';
import {UserStore} from '../../core/store/authentication/user.store';
import {Router} from '@angular/router';
import {SimpleRecipeCard} from './simple-recipe-card/simple-recipe-card';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-recipes',
  imports: [
    SpinnerComponent,
    SimpleRecipeCard,
    TranslatePipe
  ],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
  standalone: true
})

export default class Recipes implements OnInit {
  protected readonly recipeStore = inject(RecipeStore);
  private route = inject(ActivatedRoute);
  private userStore = inject(UserStore);
  private router = inject(Router)

  tag: string | null = null;
  category: string | null = null;
  username: string | null = null;
  my: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tag = params.get('tag');
      this.username = params.get('username');
      this.category = params.get('category');
      if (this.tag) {
        this.recipeStore.loadSearch({searchTerm: this.tag, searchFilter: "tag"});
      } else if (this.username) {
        this.recipeStore.loadSearch({searchTerm: this.username, searchFilter: "user"});
      } else if (this.category) {
        this.recipeStore.loadSearch({searchTerm: this.category, searchFilter: "category"});
      } else if (this.router.url === '/recipes/my') {
        console.log("ok")
        const currentUsername1 = this.userStore.getUsername();
        this.my = true;
        this.recipeStore.loadSearch({searchTerm: currentUsername1 ?? this.username ?? '', searchFilter: "user"});
      } else {
        if (this.recipeStore.recipes().length === 0) {
          this.recipeStore.loadRecipes();
        }
      }
    });
  }

  recipes = this.recipeStore.simpleRecipes;

  loadMore() {
    if (this.tag) {
      this.recipeStore.loadMoreSearch({searchTerm: this.tag, searchFilter: "tag"});
    } else if (this.username) {
      this.recipeStore.loadMoreSearch({searchTerm: this.username, searchFilter: "user"});
    } else if (this.category) {
      this.recipeStore.loadMoreSearch({searchTerm: this.category, searchFilter: "category"});
    } else if (this.my) {
      const currentUsername1 = this.userStore.getUsername();
      this.recipeStore.loadMoreSearch({searchTerm: currentUsername1 ?? this.username ?? '', searchFilter: "user"});
    } else {
      this.recipeStore.loadMoreRecipes();
    }
  }

}
