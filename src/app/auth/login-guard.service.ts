import { Injectable } from '@angular/core';
import {
   ActivatedRouteSnapshot,
   CanActivate,
   Router,
   RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthJwtService } from './auth-jwt.service';

@Injectable({
   providedIn: 'root',
})
export class LoginGuard implements CanActivate {
   constructor(protected authJwtService: AuthJwtService, protected router: Router) {}

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): boolean | Observable<boolean> | Promise<boolean> {
      return this.authJwtService.authStatus$.pipe(
         map((autStatus) => {
            if (autStatus.isAuthenticated) {
               this.router.navigate(['/']);
            }
            return true;
         })
      );
   }
}
