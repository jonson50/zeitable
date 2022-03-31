import { Injectable } from '@angular/core';
import {
   ActivatedRouteSnapshot,
   CanActivate,
   CanActivateChild,
   CanLoad,
   Route,
   Router,
   RouterStateSnapshot,
   UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Role } from './auth.enum';
import { AuthService } from './auth.service';

@Injectable({
   providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
   constructor(protected authService: AuthService, protected router: Router) {}

   canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
      return this.checkLogin();
   }

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): boolean | Observable<boolean> | Promise<boolean> {
      return this.checkLogin(route);
   }

   canActivateChild(
      childRoute: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): boolean | Observable<boolean> | Promise<boolean> {
      return this.checkLogin(childRoute);
   }

   protected checkLogin(route?: ActivatedRouteSnapshot): Observable<boolean> {
      return this.authService.authStatus$.pipe(
         map((autStatus) => {
            const roleMatch = this.checkRoleMatch(autStatus.userRole, route);
            const allowLogin = autStatus.isAuthenticated && roleMatch;
            if (!allowLogin) {
               this.router.navigate(['login'], {
                  queryParams: {
                     redirectUrl: this.getResolvedUrl(route),
                  },
               });
            }
            return allowLogin;
         }),
         take(1)
      );
   }

   getResolvedUrl(route?: ActivatedRouteSnapshot): string {
      if (!route) {
         return '';
      }
      return route.pathFromRoot
         .map((r) => r.url.map((segment) => segment.toString()).join('/'))
         .join('/')
         .replace('//', '/');
   }

   private checkRoleMatch(role: Role, route?: ActivatedRouteSnapshot) {
      if (!route?.data['expectedRole']) {
         return true;
      }
      return role === route?.data['expectedRole'];
   }
}
