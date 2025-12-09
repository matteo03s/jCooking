import {Component, inject, OnInit} from '@angular/core';
import {ReviewStore} from '../../../core/store/reviews/review.store';
import {Review} from '../../../core/store/reviews/model/review';
import SpinnerComponent from '../../../core/components/spinner/spinner';
import {ActivatedRoute, Router} from '@angular/router';
import ReviewCard from '../review-card/review-card';
import {UserStore} from '../../../core/store/authentication/user.store';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-review-list',
  imports: [
    SpinnerComponent,
    ReviewCard,
    TranslatePipe
  ],
  templateUrl: './review-list.html',
  standalone: true,
  styleUrl: './review-list.scss'
})
export default class ReviewList implements OnInit {
  private reviewStore = inject(ReviewStore);
  private userStore = inject(UserStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  recipeId: number | null = null;
  username: string | null = null;
  my: boolean = false;

  isLoading = this.reviewStore.isLoading;
  reviews = this.reviewStore.reviews;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParamRecipe = params.get('recipeId');
      this.username = params.get('username');
      this.recipeId = idParamRecipe !== null ? Number(idParamRecipe) : null;
      if (this.recipeId) {
        this.reviewStore.getReviewsByRecipe(this.recipeId);
      } else if (this.username) {
        this.reviewStore.getReviewsByUser(this.username);
      } else if (this.router.url === '/reviews/my') {
        console.log("ok")
        const currentUsername = this.userStore.getUsername();
        // Recupera l'utente corrente dallo UserStore
        this.my = true;
        this.reviewStore.getReviewsByUser(currentUsername!);
      } else {
        this.reviewStore.getAllReviews();
      }
    })
  }

  trackById(index: number, review: Review) {
    return review.id;
  }
}
