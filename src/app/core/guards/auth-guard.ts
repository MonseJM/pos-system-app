import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard = (route: any, state: any) => {

  const auth = inject(Auth);
  const router = inject(Router);

  const token = auth.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const role = auth.getRole();

  if (role?.toLowerCase() !== 'admin') {
    router.navigate(['/home']);
    return false;
  }

  return true;
};