import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { ToastType } from '../_components/message.enum';
import { MessageService } from '../_components/message.service';
import { Account } from '../_models/account';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const account = this.authService.accountValue;
    const token = this.authService.getToken();
    
    if (account.id !== '' && account.authenticated) {
      // This is called when user uses login page
      return true;
    } else {
      // this is called only if user reload page and is already logged in
      if (token) {
        this.authService.validateSession().pipe(
          map((account: Account) => {
            this.messageService.showToast(`Welcome back ${account.fullName}`, ToastType.success)
          })
        ).subscribe();
        return true;

      } else {
        this.messageService.showToast('You must login to continue', ToastType.danger, 5000)
        this.router.navigate(['/login']);
        return true;
      }
    }
  }

}
