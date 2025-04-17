import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): true | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = auth.isLoggedIn();
  const url = state.url;

  console.log('Navigating to:', url);
  console.log('Is Logged In:', isLoggedIn);

  // Public routes (include root path)
  const isPublicRoute =
    url === '/' ||
    url === '' ||
    url.includes('/login') ||
    url.includes('/register');

  if (isLoggedIn && isPublicRoute) {
    return router.createUrlTree(['/dashboard']);
  }

  if (!isLoggedIn && !isPublicRoute) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
