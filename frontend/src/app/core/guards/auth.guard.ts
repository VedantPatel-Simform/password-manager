import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of, map, catchError } from 'rxjs';
import { KeyStorageService } from '../services/User/key-storage.service';
import { UserDetailsService } from '../services/User/user-details.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const url = state.url;
  const keyService = inject(KeyStorageService);
  const userService = inject(UserDetailsService);
  // Match base public routes and any of their children
  const isPublicRoute =
    url.startsWith('/login') || url.startsWith('/register') || url === '/';

  return http
    .get<{ success: boolean; message: string }>('/authentication/check-session')
    .pipe(
      map((res) => {
        const isLoggedIn = res.success;

        if (isLoggedIn && isPublicRoute) {
          return router.createUrlTree(['/dashboard']);
        }

        if (!isLoggedIn && !isPublicRoute) {
          return router.createUrlTree(['/login']);
        }

        return true;
      }),
      catchError((err) => {
        console.warn('Auth Guard | Session check failed:', err);
        keyService.clearAllKeys();
        userService.clearUserDetails();
        // On error, assume not logged in and restrict private routes
        if (!isPublicRoute) {
          return of(router.createUrlTree(['/login']));
        }

        return of(true);
      })
    );
};
