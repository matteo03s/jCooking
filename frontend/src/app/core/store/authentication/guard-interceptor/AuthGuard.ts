import {inject, Injectable} from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthStore} from '../authentication.store';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  canActivate(): boolean {
    const token = this.authStore.tokenSignal();
    if (token) {
      console.log(token);
      return true;
    }
    console.log(token);
    this.router.navigate(['/sign-in']);
    return false;
  }
}
