import { Injectable } from '@angular/core';
import {
   ActivatedRouteSnapshot,
   CanActivate,
   Router,
   RouterStateSnapshot
} from '@angular/router';
import { catchError, map, Observable, from, take } from 'rxjs';
import { AuthService } from '@app/core/_services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
   providedIn: 'root',
})
export class LoginGuard implements CanActivate {
   constructor(protected authService: AuthService,
      protected router: Router,
      private spinnerService: NgxSpinnerService) { }

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): boolean | Observable<boolean> | Promise<boolean> {
      const token = this.authService.token;
      const account = this.authService.accountValue;

      if (account.id && account.authenticated) {
         // there is already a logged in user
         this.router.navigate(['/']);
         return false;
      } else {
         // There is a token but not a logged in user
         if (token) {
            this.spinnerService.show();
            return this.authService.isSessionValid(token).then(
               () => {
                  this.router.navigate(['/']);
                  return false;
               },
               error => {
                  console.error(error.code)
                  this.authService.clearToken();
                  return true;
               }
            ).finally(
               () => { this.spinnerService.hide(); }
            );
         } else {
            return true;
         }
      }
   }
}
