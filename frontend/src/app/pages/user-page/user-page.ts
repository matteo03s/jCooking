import {Component, inject, OnInit} from '@angular/core';
import {UserStore} from '../../core/store/authentication/user.store';
import {User} from '../../core/store/authentication/model/user';
import {SafeAvatarPipe} from '../../core/pipe/safe-avatar.pipe';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-user-page',
  imports: [
    SafeAvatarPipe,
    TranslatePipe
  ],
  templateUrl: './user-page.html',
  styleUrl: './user-page.scss'
})
export default class UserPage implements OnInit {
  private userStore = inject(UserStore); // se vuoi farlo qui direttamente
  currentUsername: string | null = null;
  user: User | null = null;

  ngOnInit(): void {
    this.user = this.userStore.currentUser();
    console.log(this.user)
  /*  this.currentUsername = this.userStore.getUsername();
    const user$ = this.userStore.getUser(this.currentUsername!);

    user$.subscribe(userJSON => {
      this.user = User.fromJSON(userJSON); // se vuoi trasformarlo in User
  console.log(this.user);
    });
  */}
}
