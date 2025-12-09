// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getItem('token');

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
