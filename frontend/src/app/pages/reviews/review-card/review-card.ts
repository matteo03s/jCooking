import {Component, inject, Input, signal} from '@angular/core';
import {Review} from '../../../core/store/reviews/model/review';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ReviewStore} from '../../../core/store/reviews/review.store';
import {ConfirmModalComponent} from '../../../core/components/modal-component/modal-component';
import {BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './review-card.html',
  styleUrls: ['./review-card.scss', '../../recipes/details.scss']
})
export default class ReviewCard {
  constructor(private modalService: BsModalService) {}
  reviewStore = inject(ReviewStore);
  showDeleteModal = signal(false);

  @Input() review!: Review;
  @Input() removable: boolean = false;

  confirmDelete() {
    this.showDeleteModal.set(true);
  }

  deleteReview() {
    if (this.review) {
      this.reviewStore.deleteReview(this.review.id!);
      this.showDeleteModal.set(false);
    }
  }
  protected readonly signal = signal;

  openModal(reviewId: number) {
    const modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'MODAL.REVIEW.TITLE',
        message: 'MODAL.REVIEW.MESSAGE'
      },
      backdrop: 'static',
      class: 'modal-md'
    });

    modalRef.content?.confirm.subscribe(() => {
      this.reviewStore.deleteReview(reviewId);
    });
  }
}
