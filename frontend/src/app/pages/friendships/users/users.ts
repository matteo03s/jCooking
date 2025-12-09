import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {UserStore} from '../../../core/store/authentication/user.store';
import {RouterLink} from '@angular/router';
import {FriendshipStore} from '../../../core/store/friendship/friendship.store';
import {SafeAvatarPipe} from '../../../core/pipe/safe-avatar.pipe';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    RouterLink,
    SafeAvatarPipe,
    TranslatePipe
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export default class Users implements OnInit{
  userStore = inject(UserStore);
  friendshipStore = inject (FriendshipStore);

  searchTerm = signal('');


  filteredUsers = computed(() => {
    const currentUsername = this.userStore.currentUser()?.username;
    const friends = this.friendshipStore.friends();
    const requests = this.friendshipStore.requests();
    const search = this.searchTerm().toLowerCase().trim();


    return this.userStore.otherUsers().filter(user => {
      const isFriend = friends.some(f =>
        f.senderName === user.username || f.receiverName === user.username
      );
      const hasPendingRequest = requests.some(r =>
        (r.senderName === user.username || r.receiverName === user.username) && r.status === 'PENDING'
      );

      const matchesSearch = user.username?.toLowerCase().includes(search);

      return !isFriend && !hasPendingRequest && matchesSearch;
    });
  });


  ngOnInit() {
    this.userStore.loadAllUsers();
    this.friendshipStore.loadRequests(); // carica richieste pendenti
    this.friendshipStore.loadFriends();  // carica amici
  }

  sendFriendRequest(receiverId: number) {
    this.friendshipStore.sendRequest(receiverId);
  }

}
