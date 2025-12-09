import { Component, inject, signal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RecipeStore} from '../../../store/recipe/recipe.store';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-navbar-search',
  templateUrl: './navbar-search.html',
  styleUrls: ['./navbar-search.scss'],
  imports: [
    FormsModule,
    TranslatePipe
  ],
  standalone: true
})
export class NavbarSearch {
  recipeStore = inject(RecipeStore);
  searchTerm: string = '';
  searchFilter: string = 'title';
  dropdownOpen = signal(false);

  filters = [
    { label: 'SEARCH.TITLE', value: 'title' },
    { label: 'SEARCH.AUTHOR', value: 'author' },
    { label: 'Tag', value: 'tags' },
    { label: 'SEARCH.LEVEL', value: 'level' },
    { label: 'SEARCH.CATEGORY', value: 'category' },
    { label: 'SEARCH.RATING', value: 'averageRating' }
  ];

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  selectFilter(value: string) {
    this.searchFilter = value;
    this.dropdownOpen.set(false);
  }

  getCurrentFilterLabel() {
    const current = this.filters.find(f => f.value === this.searchFilter);
    return current ? current.label : 'Filtro';
  }

  onSearch() {
    console.log(this.searchTerm)
    console.log(this.searchFilter)
    const value =
      this.searchFilter === 'averageRating'
        ? Number(this.searchTerm)
        : this.searchTerm.trim();
    if (!this.searchTerm.trim()) return;
    this.recipeStore.loadSearch({
      searchTerm: this.searchTerm,
      searchFilter: this.searchFilter,
    });
  }
}
