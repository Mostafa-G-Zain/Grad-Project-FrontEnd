import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  // check if user is logged in
  if(!user || !authService.token){
    router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }

  // check if user has the expected role
  const expectedRole = route.data['role'] as Array<string>;

  if (expectedRole && expectedRole.includes(user.role)){
    return true;
  }

  alert('You are not authorized to access this page');
  router.navigate(['/']);
  return false;
};
