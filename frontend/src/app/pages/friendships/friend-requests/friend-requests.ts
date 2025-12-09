import {Component, inject, OnInit} from '@angular/core';
import {FriendshipStore} from '../../../core/store/friendship/friendship.store';
import {RouterLink} from '@angular/router';
import {UserStore} from '../../../core/store/authentication/user.store';
import {SafeAvatarPipe} from '../../../core/pipe/safe-avatar.pipe';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-friend-requests',
  standalone: true,
  imports: [RouterLink, SafeAvatarPipe, TranslatePipe],
  templateUrl: './friend-requests.html',
  styleUrl: './friend-requests.scss'
})
export default class FriendRequests implements OnInit {
  friendshipStore = inject(FriendshipStore);
  userStore = inject(UserStore);

  username: string = '';

  ngOnInit() {
    this.username = this.userStore.getUsername()!;
    this.friendshipStore.loadReceived();
    this.friendshipStore.loadSent();
  }
    requests = this.friendshipStore.requests;

  accept(id: number) {
    this.friendshipStore.respondRequest({ id, accept: true });
    window.location.reload();
  }
  decline(id: number) {
    this.friendshipStore.respondRequest({ id, accept: false });
    window.location.reload();
  }
}
