// logout.component.ts
import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../services/authentication-service';
import {AuthStore} from '../authentication.store';

@Component({ template: '' })
export default class LogoutComponent {
  authStore = inject(AuthStore);
  constructor(private auth: AuthService, private router: Router) {
    this.authStore.logoutUser();
//    this.auth.logout();
    this.router.navigate(['/']);
  }
}
