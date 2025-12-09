import {Component, inject, OnInit} from '@angular/core';
import {UserStore} from '../../../core/store/authentication/user.store';
import SpinnerComponent from '../../../core/components/spinner/spinner';
import {SafeAvatarPipe} from '../../../core/pipe/safe-avatar.pipe';
import {RouterLink} from '@angular/router';
import {CarouselComponent} from '../../../core/components/carousel-component/carousel-component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-top-authors',
  imports: [
    SpinnerComponent,
    SafeAvatarPipe,
    RouterLink,
    CarouselComponent,
    TranslatePipe
  ],
  templateUrl: './top-authors.html',
  standalone: true,
  styleUrl: './top-authors.scss'
})
export class TopAuthors implements OnInit {
  userStore = inject(UserStore);

  ngOnInit () {
    this.userStore.loadBestUsers();
  }

  authors = this.userStore.otherUsers;


  chunkedAuthors() {
    const itemsPerSlide = 3;
    const result = [];
    const list = this.authors();

    for (let i = 0; i < list.length; i += itemsPerSlide) {
      result.push(list.slice(i, i + itemsPerSlide));
    }

    return result;
  }
}
