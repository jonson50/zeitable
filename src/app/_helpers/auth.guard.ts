import { Injectable } from '@angular/core';
import {
   ActivatedRouteSnapshot,
   CanActivate,
   CanActivateChild,
   Router,
   RouterStateSnapshot
} from '@angular/router';
import { lastValueFrom, Observable, of, throwError } from 'rxjs';
import { catchError, first, map, shareReplay, take, tap } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';
import { Account, IRole } from '@app/_models/account';
import { transformError } from './common';
import { MessageService } from '@app/_components/message.service';

@Injectable({
   providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
   constructor(
      private authService: AuthService, 
      private router: Router,
      private messageService: MessageService) { }

   // canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
   //    return this.checkLogin();
   // }

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): boolean | Observable<boolean> | Promise<boolean> {
      return this.checkLogin(route, state);
   }

   canActivateChild(
      childRoute: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): boolean | Observable<boolean> | Promise<boolean> {
      return this.checkLogin(childRoute, state);
   }

   protected checkLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
      const account = this.authService.accountValue;
      const token = this.authService.getToken();

      if (account.id !== '' && account.authenticated) {
         return this.checkRoleMatch(account, route);
      } else {
         if (token) {
            return this.authService.validateSession().pipe(
               map((account: Account) => this.checkRoleMatch(account, route)),
               take(1)
            );
         } else {
            this.messageService.showToast('You must login to continue')
            this.router.navigate(['/login']);
            return true;
         }
      }
   }

   private getResolvedUrl(route?: ActivatedRouteSnapshot): string {
      if (!route) {
         return '';
      }
      return route.pathFromRoot
         .map((r) => r.url.map((segment) => segment.toString()).join('/'))
         .join('/')
         .replace('//', '/');
   }

   private checkRoleMatch(account: Account, route?: ActivatedRouteSnapshot): boolean {
      let roles = account.roles;
      let isValidRoles = false;
      let roleMatch = false;
      this.messageService.showToast('Welcome back..')
      if (route?.data?.['roles']) {
         console.log('tiene route.data.roles')
         roles.forEach(e => {
            if (route?.data['roles'].includes(e)) isValidRoles = true;
         })
         roleMatch = route?.data['roles'] && !isValidRoles;
      } else {
         console.log('NO tiene route.data.roles')
         roleMatch = true;
      }
      const allowLogin = account.authenticated && roleMatch
      if (!allowLogin) {
         // this.showAlert(authStatus.isAuthenticated, roleMatch)
         this.router.navigate(['/'], {
            queryParams: {
               redirectUrl: this.getResolvedUrl(route),
            },
         })
      }
      return allowLogin
   }
}
