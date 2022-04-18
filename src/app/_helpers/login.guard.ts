import { Injectable } from '@angular/core';
import {
   ActivatedRouteSnapshot,
   CanActivate,
   Router,
   RouterStateSnapshot
} from '@angular/router';
import { catchError, map, Observable, of, take } from 'rxjs';
import { AuthService } from '@app/_services/auth.service';

@Injectable({
   providedIn: 'root',
})
export class LoginGuard implements CanActivate {
   constructor(protected authService: AuthService, protected router: Router) {}

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): boolean | Observable<boolean> | Promise<boolean> {
      const token = this.authService.getToken();
      const account = this.authService.accountValue;
      
      if (account.id !== '' && account.authenticated) {
         // there is already a logged in user
         this.router.navigate(['/']);
         return false;
      } else {
         // There is a token but not a logged in user
         if (token) {
            return this.authService.validateSession().pipe(
               map((account: any) => {
                  this.router.navigate(['/']);
                  return false;
               }),
               take(1)
            );
         } else {
            return true;
         }
      }
   }
}
