import { Injectable } from '@angular/core';
import {
   HttpRequest,
   HttpHandler,
   HttpEvent,
   HttpInterceptor,
   HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@app/_services';
import { environment } from '@environments/environment';
import { Account } from '@app/_models/account';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

   constructor(private authService: AuthService) { }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const newRequest = request.clone({
         headers: this.addExtraHeaders(request.headers)
      })
      return next.handle(newRequest);
   }

   private addExtraHeaders(headers: HttpHeaders): HttpHeaders {
      const token: string = this.authService.getToken();
      headers = headers.append('X-Parse-Application-Id', environment.APP_ID);
      headers = headers.append('X-Parse-REST-API-Key', environment.API_KEY);
      if (token) {
         headers = headers.append('X-Parse-Session-Token', token);
      }
      return headers;
    } 
}
