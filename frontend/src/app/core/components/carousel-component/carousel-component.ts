import {Component, Input} from '@angular/core';
import {LowerCasePipe, NgTemplateOutlet} from '@angular/common';
import SpinnerComponent from '../spinner/spinner';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-carousel',
  imports: [
    NgTemplateOutlet,
    SpinnerComponent,
    TranslatePipe
  ],
  templateUrl: './carousel-component.html',
  styleUrl: './carousel-component.scss',
  standalone: true
})
export class CarouselComponent {

  @Input() title!: string;
  @Input() isLoading: boolean = false;
  @Input() target!: string;
  @Input() items: any[] = [];
  @Input() itemsPerSlide = 3;
  @Input() itemTemplate!: any; // NgTemplateRef

  chunkItems() {
    const result = [];
    const list = this.items;

    for (let i = 0; i < list.length; i += this.itemsPerSlide) {
      result.push(list.slice(i, i + this.itemsPerSlide));
    }
    return result;
  }
}
