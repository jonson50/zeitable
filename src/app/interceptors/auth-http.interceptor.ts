import { Injectable } from '@angular/core';
import {
   HttpRequest,
   HttpHandler,
   HttpEvent,
   HttpInterceptor,
   HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth-parse.service';
import { AppSettings } from '../common/app-settings';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

   constructor(private authService: AuthService) { }

   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      const sessionToken = this.authService.getToken();
      const newRequest = request.clone({
         setHeaders: {
            'X-Parse-Application-Id': AppSettings.APP_ID,
            'X-Parse-REST-API-Key': AppSettings.API_KEY
         }
      })
      if (sessionToken) {
         newRequest.headers.set('X-Parse-Session-Token',sessionToken)
      }
      return next.handle(newRequest);
   }
}
