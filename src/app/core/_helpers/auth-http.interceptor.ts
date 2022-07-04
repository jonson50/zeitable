import { Injectable } from '@angular/core';
import {
   HttpRequest,
   HttpHandler,
   HttpEvent,
   HttpInterceptor,
   HttpHeaders
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { AuthService } from '@app/core/_services';
import { environment } from '@environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

   totalRequests = 0;
   completedRequests = 0;
   constructor(private authService: AuthService, private spinnerService: NgxSpinnerService) { }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.spinnerService.show();
      this.totalRequests++;

      const newRequest = request.clone({
         headers: this.addExtraHeaders(request.headers)
      })

      return next.handle(newRequest).pipe(
         finalize(() => {
            // Handling spinner for multiple request to server
            this.completedRequests++;
            // console.log(this.completedRequests, this.totalRequests);
            if (this.completedRequests === this.totalRequests) {
               this.spinnerService.hide();
               this.completedRequests = 0;
               this.totalRequests = 0;
             }
         })
       );
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
