import {Component, EventEmitter, Input, Output, inject, OnInit} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatingSingleLineInput } from '../../../core/components/floating-input/floating-Single-line-input';
import { FloatingTextarea } from '../../../core/components/floating-input/floating-textarea';
import { Slider } from '../../../core/components/slider/slider';
import {ReviewStore} from '../../../core/store/reviews/review.store';
import {Review} from '../../../core/store/reviews/model/review';
import {ActivatedRoute} from '@angular/router';
import {Rating} from '../../../core/components/rating/rating';
import {SubmitButton} from '../../../core/components/submit-button/submit-button';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingSingleLineInput,
    FloatingTextarea,
    Slider,
    Rating,
    SubmitButton,
    TranslatePipe
  ],
  templateUrl: './review-form.html',
  styleUrls: [
    './review-form.scss',
    '../../recipe-form/recipe-form.scss',
    '../../recipes/details.scss',
  ]
})
export default class ReviewForm implements OnInit {
  fb = inject(FormBuilder);
  protected reviewStore = inject(ReviewStore);
  private route = inject(ActivatedRoute);

  recipeId!: number; // collegamento alla ricetta
  @Output() reviewCreated = new EventEmitter<Review>();

  sliderTitle = 'Rating (1–10)';

  reviewForm = this.fb.group({
    title: this.fb.control<string>("", {validators: [Validators.required, Validators.maxLength(64)]}),
    comment: this.fb.control<string | null> (null),
    rating: this.fb.control<number> (1, {validators: [Validators.required, Validators.min(1), Validators.max(10)]})
  });

  ngOnInit(): void {
    // ascolta i cambiamenti dei parametri della route
    this.recipeId = Number(this.route.snapshot.paramMap.get('recipeId'));
    console.log (this.recipeId);
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      const firstInvalid = document.querySelector('.ng-invalid:not(form)');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstInvalid as HTMLElement).focus();
      }
      return;
    }

    const formValue = this.reviewForm.value;

    const review = new Review({
      title: formValue.title!,
      comment: formValue.comment!,
      rating: formValue.rating!,
      recipe: { id: this.recipeId, title: '' } // collegamento alla ricetta
    });
    this.reviewStore.addReview({ review, recipeId: this.recipeId });

  }
}
