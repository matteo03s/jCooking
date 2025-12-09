import {Component, inject, Input} from '@angular/core';
import {CarouselComponent} from '../../../../core/components/carousel-component/carousel-component';
import {ImageJSON} from '../../../../core/store/recipe/model/ImageJSON';
import {ConfirmModalComponent} from '../../../../core/components/modal-component/modal-component';
import {BsModalService} from 'ngx-bootstrap/modal';
import {RecipeStore} from '../../../../core/store/recipe/recipe.store';

@Component({
  selector: 'app-image-carousel',
  imports: [
    CarouselComponent
  ],
  templateUrl: './image-carousel.html',
  styleUrls: ['./image-carousel.scss', '../../details.scss'],
  standalone: true
})
export class ImageCarousel {
  constructor(private modalService: BsModalService) {}
  recipeStore = inject(RecipeStore);
  backendBaseUrl = "http://localhost:8080"
  @Input() images: ImageJSON[] = [];
  @Input() title: string ="RECIPE.IMAGES";
  @Input() removable: boolean = false;
  @Input() recipeId: number = 0;
  @Input() itemsPerSlide: number = 1;


  openModal(imageId: number) {
    const modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        title: 'MODAL.IMAGE.TITLE',
        message: 'MODAL.IMAGE.MESSAGE'
      },
      backdrop: 'static',
      class: 'modal-md'
    });

    modalRef.content?.confirm.subscribe(() => {
      this.recipeStore.deleteImageFromRecipe({
        recipeId: this.recipeId,
        imageId: imageId
      });
    });
  }
}
