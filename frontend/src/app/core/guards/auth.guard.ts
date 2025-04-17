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

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const url = state.url;

  // Match base public routes and any of their children
  const isPublicRoute =
    url.startsWith('/login') || url.startsWith('/register') || url === '/';

  return http
    .get<{ success: boolean; message: string }>('/authentication/check-session')
    .pipe(
      map((res) => {
        const isLoggedIn = res.success;
        console.log('Auth Guard | Session valid:', isLoggedIn, '| URL:', url);

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

        // On error, assume not logged in and restrict private routes
        if (!isPublicRoute) {
          return of(router.createUrlTree(['/login']));
        }

        return of(true);
      })
    );
};
