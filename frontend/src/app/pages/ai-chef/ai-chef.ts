import {Component, computed, inject, OnDestroy} from '@angular/core';
import {AiChefStore} from '../../core/store/aiChef/aiChef.store';
import {RecipeStore} from '../../core/store/recipe/recipe.store';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import RecipeDetails from '../recipes/recipe-details/recipe-details';
import SpinnerComponent from '../../core/components/spinner/spinner';
import {UserStore} from '../../core/store/authentication/user.store';
import {FloatingTextarea} from '../../core/components/floating-input/floating-textarea';
import {FloatingSingleLineInput} from '../../core/components/floating-input/floating-Single-line-input';
import {SubmitButton} from '../../core/components/submit-button/submit-button';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-ai-chef',
  imports: [
    FormsModule,
    RecipeDetails,
    SpinnerComponent,
    FloatingTextarea,
    FloatingSingleLineInput,
    ReactiveFormsModule,
    SubmitButton,
    TranslatePipe
  ],
  templateUrl: './ai-chef.html',
  styleUrl: './ai-chef.scss',
  standalone: true
})
export default class AiChef implements OnDestroy {

  readonly aiStore = inject(AiChefStore);
  readonly recipeStore = inject(RecipeStore);
  readonly userStore = inject(UserStore);

  private fb = inject(FormBuilder);
  aiForm = this.fb.group({
    ingredients: ['', [Validators.required, Validators.minLength(3)]],
    type: ['']
  });

  isLogged = computed(() =>
    this.userStore.isLogged()
  )
generate(): void {
    if (this.aiForm.invalid) {
      this.aiForm.markAllAsTouched();
      return;
    }
    const formValue = this.aiForm.getRawValue();
    this.aiStore.generateRecipe({
      ingredients: formValue.ingredients || '',
      type: formValue.type || ''
    });
  }

  saveRecipe(): void {
    const draft = this.aiStore.draftRecipe();
    if (draft) {
      this.recipeStore.addRecipe(draft);
    }
  }

  discard(): void {
    this.aiStore.clearDraft();
    // this.aiForm.reset();
  }

  ngOnDestroy(): void {
    this.aiStore.clearDraft();
  }
}
