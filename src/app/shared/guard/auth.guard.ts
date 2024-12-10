import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject the AuthService
  const router = inject(Router); // Inject the Router for navigation

  if (authService.isLoggedIn) {
    return true;
  } else {
    router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};