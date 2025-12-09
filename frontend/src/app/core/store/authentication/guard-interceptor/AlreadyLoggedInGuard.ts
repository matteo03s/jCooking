import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {LocalStorageService} from '../../../services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AlreadyLoggedInGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.localStorageService.getItem('token');
    if (token) {
      this.router.navigate(['/']); // o dove vuoi reindirizzare
      return false;
    }
    return true;
  }
}
