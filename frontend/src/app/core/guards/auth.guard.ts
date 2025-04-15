import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
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
  const currentPath = route.url[0]?.path;

  console.log('Current Path:', currentPath);
  console.log('Is Logged In:', isLoggedIn);

  // If logged in and trying to access login or register, redirect to dashboard
  if (isLoggedIn && (currentPath === 'login' || currentPath === 'register')) {
    return router.createUrlTree(['/dashboard']);
  }

  // If not logged in and trying to access a protected route, redirect to login
  if (!isLoggedIn && currentPath !== 'login' && currentPath !== 'register') {
    return router.createUrlTree(['/login']);
  }

  // Otherwise, allow access
  return true;
};
