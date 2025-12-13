import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();
  const expectedRole = route.data['role'] as Array<string> | undefined;

  if (!user || !authService.token) {
    if (expectedRole?.includes('Vendor')) {
      return router.createUrlTree(
        ['/register-vendor'],
        { queryParams: { returnUrl: state.url } }
      );
    }

    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  if (expectedRole && !expectedRole.includes(user.role)) {
    if (expectedRole.includes('Vendor')) {
      alert('You must register as a vendor to sell cars.');
      return router.createUrlTree(
        ['/register-vendor'],
        { queryParams: { returnUrl: state.url } }
      );
    }

    alert('You are not authorized to access this page');
    return router.createUrlTree(['/']);
  }

  return true;
};
