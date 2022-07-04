import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@app/core/_services';
import { Router } from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router
        ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {     
        return next.handle(request).pipe(catchError(err => {
            console.log('INTERCEPTOR DE ERROR')
            //console.log('ERROR: ', err)
            //console.log('ACCOUNT:', this.authService.accountValue)
            let error = 'An error has appeared';
            if ([401, 403].includes(err.status) && this.authService.accountValue.sessionToken) {
                // auto logout if 401 or 403 response returned from api
                this.authService.logout();
            }
            if(err.error && err.error.code === 209) {
                console.log('ERROR 209!!!!!', err)
                this.authService.clearToken();
                this.router.navigate(['/login'])
            }

            //const error = (err && err.error && err.error.message) || err.statusText;
            //console.error(err);
            return throwError(() => new Error(error));
        }))
    }
}
