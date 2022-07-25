import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastType } from '../_components/message.enum';
import { MessageService } from '../_components/message.service';
import { AuthService } from './auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService) { }

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const account = this.authService.accountValue;
    const token = this.authService.token;

    if (account.id && account.authenticated) {
      // This is called when user uses login page
      this.greetingsMessage(account.fullName);
      return true;
    } else {
      // this is called only if user reload page and is already logged in
      if (token) {
        this.spinnerService.show();
        return this.authService.isSessionValid(token).then(
          sessionAccount => {
            this.greetingsMessage(sessionAccount.fullName);
            return true;
          },
          error => {
            console.error(error.code)
            this.authService.clearToken();
            this.mustLoginMessage();
            return false;
          }
        ).finally(
          () => { this.spinnerService.hide(); }
        );
      } else {
        this.mustLoginMessage();
        return true
      }      
    }
  }
  /**
   * show a Toast Message to login before continue
   */
  mustLoginMessage(): void {
    this.messageService.showToast('You must login to continue', ToastType.danger, 5000)
    this.router.navigate(['/login']);
  }

  /**
   * @param{string} name
   * show the Toast with the welcome message
   */
  greetingsMessage(name: string): void {
    this.messageService.showToast(`Welcome back ${name}`, ToastType.success)
  }

}
