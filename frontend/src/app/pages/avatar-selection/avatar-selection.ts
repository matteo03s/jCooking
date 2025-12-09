import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {AvatarService} from '../../core/services/avatarsService';
import {CarouselComponent} from '../../core/components/carousel-component/carousel-component';


@Component({
  selector: 'app-avatar-selection',
  imports: [
    CarouselComponent
  ],
  templateUrl: './avatar-selection.html',
  styleUrl: './avatar-selection.scss'
})
export default class AvatarSelection implements OnInit {
  avatarService = inject(AvatarService)
  avatars: string[] = [];
  @Input() selectedAvatar: string = '';
  @Output() avatarSelected = new EventEmitter<string>();

  ngOnInit(): void {
    this.avatarService.getAvatars().subscribe(data => {
      this.avatars = data;
    });
  }
  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    this.avatarSelected.emit(avatar);
  }
  confirmAvatar(selectAvatar:(avatar: string) => void) {

  }
}
