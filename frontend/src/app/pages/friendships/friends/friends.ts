import {Component, inject, OnInit} from '@angular/core';
import {FriendshipStore} from '../../../core/store/friendship/friendship.store';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {UserStore} from '../../../core/store/authentication/user.store';
import {SafeAvatarPipe} from '../../../core/pipe/safe-avatar.pipe';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    SafeAvatarPipe,
    TranslatePipe
  ],
  templateUrl: './friends.html',
  styleUrl: './friends.scss'
})
export default class Friends implements OnInit {
  friendshipStore = inject(FriendshipStore);
  userStore = inject(UserStore);

  username: string = '';

  ngOnInit() {
    this.username = this.userStore.getUsername()!;
    this.friendshipStore.loadFriends();
  }
}
