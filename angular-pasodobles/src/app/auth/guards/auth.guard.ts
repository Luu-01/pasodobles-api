import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (currentUser) {
    return true;
  }

  if (authService.getToken() === '') {
    router.navigate(['/auth/login']);
    return false;
  }

  return authService.loadCurrentUser().pipe(
    map((user) => {
      if (user) {
        return true;
      }

      router.navigate(['/auth/login']);
      return false;
    }),
    catchError(() => {
      authService.cleanSession();
      return of(false);
    })
  );
};
