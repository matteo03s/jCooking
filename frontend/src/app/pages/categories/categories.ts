import {Component, effect, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CategoryStore} from '../../core/store/category/category.store';
import {Category, CategoryJSON} from '../../core/store/category/category';
import {TranslatePipe} from '@ngx-translate/core';

/*interface Category {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}*/
@Component({
  selector: 'app-categories',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})

export default class Categories implements OnInit {
  categoryStore = inject(CategoryStore);
  categories: CategoryJSON[] = [];

  constructor() {
    effect(() => {
      const storeCategories = this.categoryStore.categories();

      this.categories = storeCategories.map(cat => ({
        name: cat.name,
        slug: cat.slug,
        pathIcon: cat.pathIcon,
        description: cat.description
      }));
    });
  }

  ngOnInit(): void {
    if (this.categoryStore.isCategoriesEmpty()) {
      this.categoryStore.getAllCategories();
    }
  }
}
