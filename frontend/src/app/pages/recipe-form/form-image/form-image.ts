import {Component, computed, inject, OnInit} from '@angular/core';
import {ImageJSON} from '../../../core/store/recipe/model/ImageJSON';
import {RecipeStore} from '../../../core/store/recipe/recipe.store';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ImageCarousel} from '../../recipes/recipe-details/image-carousel/image-carousel';
import {SubmitButton} from '../../../core/components/submit-button/submit-button';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-form-image',
  imports: [
    ImageCarousel,
    RouterLink,
    SubmitButton,
    TranslatePipe
  ],
  templateUrl: './form-image.html',
  styleUrl: './form-image.scss',
  standalone: true
})
export default class FormImage implements OnInit {
  recipeId: number = 1;
  selectedFiles: File[] = [];
  route = inject(ActivatedRoute);
  protected recipeStore = inject(RecipeStore);

  recipe = computed(() => {
    this.recipeId = +this.route.snapshot.paramMap.get('id')!;
    return this.recipeStore.recipes().find(r => r.id === this.recipeId);
  });

  recipeImages = computed(() => this.recipe()?.images ?? []
  );


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.recipeId = +id;

        const found = this.recipeStore.recipes().some(r => r.id === this.recipeId);
        if (!found) {
          this.recipeStore.getRecipeById(this.recipeId);
        }
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = [];
    const file = event.target.files?.[0];
    this.selectedFiles = file ? [file] : [];
  }

  uploadImages(recipeId: number): void {
    if (!this.selectedFiles.length) return;
    this.selectedFiles.forEach(file => {
      this.recipeStore.uploadImageToRecipe({recipeId: recipeId, file: file});
    });

    this.selectedFiles = [];
  }

}
