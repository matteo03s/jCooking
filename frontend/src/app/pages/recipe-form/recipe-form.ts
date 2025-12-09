import {Component, effect, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Ingredient, Recipe} from '../../core/store/recipe/model/recipe';
import {RecipeStore} from '../../core/store/recipe/recipe.store';
import {MenuItem} from '../../core/components/dropdown/dropdown';
import {Slider} from '../../core/components/slider/slider';
import {FloatingTextarea} from '../../core/components/floating-input/floating-textarea';
import {FloatingSingleLineInput} from '../../core/components/floating-input/floating-Single-line-input';
import {FormDropdown} from '../../core/components/form-dropdown/form-dropdown';
import {Level} from '../../core/store/recipe/enum/levelEnum';
import {DynamicListFormComponent} from '../../core/components/dynamic-list-form/dynamic-list-form';
import {DynamicMapForm} from '../../core/components/dynamic-map-form/dynamic-map-form';
import {UnitEnum} from '../../core/store/recipe/enum/UnitEnum';
import {CategoryStore} from '../../core/store/category/category.store';
import {Category} from '../../core/store/category/category';
import {AiChefStore} from '../../core/store/aiChef/aiChef.store';
import {AiFieldsGeneratorButton} from '../../core/components/ai-fields-generator-button/ai-fields-generator-button';
import {SubmitButton} from '../../core/components/submit-button/submit-button';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    Slider,
    FloatingTextarea,
    FloatingSingleLineInput,
    FormDropdown,
    ReactiveFormsModule,
    DynamicListFormComponent,
    DynamicMapForm,
    AiFieldsGeneratorButton,
    SubmitButton,
    TranslatePipe
  ],
  templateUrl: './recipe-form.html',
  styleUrls: [ './recipe-form.scss']
})
export default class RecipeForm implements OnInit {
  fb = inject(FormBuilder);
  recipeStore = inject(RecipeStore);
  categoryStore = inject(CategoryStore);
  aiChefStore = inject(AiChefStore);

  @Input() recipe?: Recipe;

  levels: MenuItem[] = [
    { label: 'LEVEL.VERY_EASY', value: Level.VERY_EASY },
    { label: 'LEVEL.EASY', value: Level.EASY },
    { label: 'LEVEL.MEDIUM', value: Level.MEDIUM },
    { label: 'LEVEL.HARD', value: Level.HARD}
  ];
  categories: MenuItem[] = [];

  prepTitle = 'RECIPE_FORM.PREP_TIME_TITLE';
  cookTitle = 'RECIPE_FORM.COOK_TIME_TITLE';

  recipeForm = this.fb.group({
    title: this.fb.control<string>("", { validators: [Validators.required] }),
    description: this.fb.control<string>("", { validators: [Validators.required] }),
    servings: this.fb.control<number>(1, { validators: [Validators.required] }),
    level: this.fb.control<string>("", { validators: [Validators.required] }),
    category: this.fb.control<string>("", { validators: [Validators.required] }),
    prepTime: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    cookTime: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    tags: this.fb.control<string[]>([], { validators: [this.noDuplicateTagsValidator()] }),
    steps: this.fb.control<string[]>([], { validators: [this.noDuplicateTagsValidator()] }),
    ingredients: this.fb.control<Ingredient[] | null>(null, {
      validators: [this.noDuplicateNamesValidator(), Validators.required] })
  });


  constructor() {
    effect(() => {
      const storeCategories = this.categoryStore.categories();
      this.categories = storeCategories.map(cat => ({
        label: cat.name,
        value: cat.slug
      }));
    });
    effect(() => {
      const text = this.aiChefStore.generatedDescriptionText();
      if (text) {
        this.recipeForm.get('description')?.setValue(text);
        this.recipeForm.get('description')?.markAsDirty();
      }
    });
    effect(() => {
      const newTags = this.aiChefStore.generatedTags();
      if (newTags && newTags.length > 0) {
        const currentTags = (this.recipeForm.get('tags')?.value as string[]) || [];
        const mergedTags = [...new Set([...currentTags, ...newTags])]
          .filter(t => t && t.trim() !== '');
        this.recipeForm.get('tags')?.setValue(mergedTags);
        this.recipeForm.get('tags')?.markAsDirty();
      }
    });
    effect(() => {
      const newSteps = this.aiChefStore.generatedSteps();
      if (newSteps && newSteps.length > 0) {
          newSteps.filter(t => t && t.trim() !== '');
        this.recipeForm.get('steps')?.setValue(newSteps);
        this.recipeForm.get('steps')?.markAsDirty();
      }
    });
  }
  ngOnInit(): void {
    if (this.categoryStore.isCategoriesEmpty()) {
      this.categoryStore.getAllCategories();
    }
    if (this.recipe) {
      this.recipeForm.patchValue({
        title: this.recipe.title,
        description: this.recipe.description,
        servings: this.recipe.servings,
        level: this.recipe.level,
        category: this.recipe.category?.slug,
        prepTime: this.recipe.prepTime,
        cookTime: this.recipe.cookTime,
        tags: this.recipe.tags,
        steps: this.recipe.steps,
        ingredients: this.recipe.ingredients ?? []
      });
    }

  }

  noDuplicateTagsValidator(): import('@angular/forms').ValidatorFn {
    return (control) => {
      const values = (control.value || []) as string[];
      const duplicates = values.filter((v, i, arr) => v && arr.indexOf(v) !== i);
      return duplicates.length ? { duplicateTags: true } : null;
    };
  }

  noDuplicateNamesValidator(): import('@angular/forms').ValidatorFn {
    return (control) => {
      const values = (control.value || []) as Ingredient[];
      const duplicates = values
        .map(v => v.name.trim().toLowerCase())
        .filter((v, i, arr) => v && arr.indexOf(v) !== i);

      return duplicates.length ? { duplicateKeys: true } : null;
    };
  }

  askAiDescription() {
    const title = this.recipeForm.get('title')?.value;

    const ingredientsRaw = this.recipeForm.get('ingredients')?.value as Ingredient[] || [];
    const ingredientsStr = ingredientsRaw.map(i => i.name).join(', ');
    if (!title) {
      return;
    }
    this.aiChefStore.generateDescriptionOnly({
      title: title,
      ingredients: ingredientsStr
    });
  }
  askAiTags() {
    const title = this.recipeForm.get('title')?.value;
    const ingredientsRaw = this.recipeForm.get('ingredients')?.value as Ingredient[] || [];
    const ingredientsStr = ingredientsRaw.map(i => i.name).join(', ');

    if (!title) return;

    this.aiChefStore.generateTagsOnly({
      title: title,
      ingredients: ingredientsStr
    });
  }
  askAiSteps() {
    const title = this.recipeForm.get('title')?.value;
    const ingredientsRaw = this.recipeForm.get('ingredients')?.value as Ingredient[] || [];
    const ingredientsStr = ingredientsRaw.map(i => i.name).join(', ');

    if (!title) return;

    this.aiChefStore.generateStepsOnly({
      title: title,
      ingredients: ingredientsStr
    });
  }

  onSubmit() {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      const firstInvalidControl = document.querySelector('.ng-invalid:not(form):not(fieldset)');
      firstInvalidControl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (firstInvalidControl as HTMLElement)?.focus();
      return;
    }

    const formValue = this.recipeForm.value;
    const cleanedTags = (formValue.tags ?? []).map(tag => tag.trim()).filter(tag => tag !== '');
    const cleanedSteps = (formValue.steps ?? []).filter(step => step !== '');
      const cleanedIngredients: Ingredient[] = (formValue.ingredients ?? [])
        .map(i => ({
          name: i.name.trim(),
          quantity: i.quantity!,
          unit: i.unit! as UnitEnum
        }))
        .filter(i => i.name !== '' && i.quantity !== undefined && i.unit !== undefined);

      const categoryObject = { slug: formValue.category } as Category;

    const recipe = new Recipe({
      id: this.recipe?.id,
      title: formValue.title!,
      description: formValue.description!,
      prepTime: formValue.prepTime!,
      cookTime: formValue.cookTime!,
      servings: formValue.servings!,
      level: formValue.level as Level,
//      category: formValue.category as Category,
      category: categoryObject,
      tags: cleanedTags,
      steps: cleanedSteps,
      ingredients: cleanedIngredients
    });

    if (this.recipe) {
      this.recipeStore.updateRecipe(recipe);
    } else {
      this.recipeStore.addRecipe(recipe);
    }
  }
}
