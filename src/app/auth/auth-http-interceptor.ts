import {
   HttpEvent,
   HttpHandler,
   HttpInterceptor,
   HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { AuthJwtService } from './auth-jwt.service'

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

   constructor(private authJwtService: AuthJwtService, private router: Router) {}

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      console.log('INTERCEPTING here...')
      return next.handle(req);
      // const jwt = this.authJwtService.getToken();

      // const authRequest = req.clone({ setHeaders: {authorization: `Bearer ${jwt}`} });

      // return next.handle(authRequest).pipe(
      //    catchError((err, caught) => {
      //       if(err.status === 401 ) {
      //          this.router.navigate(['/login'], {queryParams: {
      //             redirectUrl: this.router.routerState.snapshot.url
      //          },})
      //       }
      //       return throwError(err);
      //    })
      // )
   }
}
