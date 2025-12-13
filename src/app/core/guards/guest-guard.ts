import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is already authenticated, redirect to home
  if (authService.token) {
    return router.createUrlTree(['/']);
  }

  // Allow access if user is not authenticated
  return true;
};

