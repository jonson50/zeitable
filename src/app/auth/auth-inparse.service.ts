import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
   AuthService,
   IParseAuthResponse
} from './auth-parse.service';
import { Observable, of, Subject, throwError, lastValueFrom, mergeMap, zip, map } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { User } from '../user/user/user';
import { AppSettings } from '../common/app-settings';
import { Router } from '@angular/router';

@Injectable()
export class InParseAuthService extends AuthService {
   private currentUser!: User;

   constructor(private http: HttpClient, private router: Router) {
      super();
   }

   protected authProvider(
      email: string,
      password: string
   ): Observable<IParseAuthResponse> {
      email.toLowerCase();
      const serverResponse$ = new Subject<IParseAuthResponse>();
      const responseParseServer = this.loggining(email, password);
      responseParseServer.then(
         (data: IParseAuthResponse) => {
            this.currentUser = new User(data);
            serverResponse$.next(data);
         },
         error => {
            console.error(error.error)
         }
      )

      return serverResponse$
   }

   private async loggining(email:string, password:string): Promise<IParseAuthResponse> {
      const body = {
         username: email,
         password: password,
      };
      const baseUrl = `${AppSettings.apiURL}/login`;
      const urlPerson = `${AppSettings.apiURL}/classes/Person`;

      const loginRequest = this.http.post<IParseAuthResponse>(baseUrl, body).pipe(
         mergeMap((resp: any) => {
            let headers = new HttpHeaders();
            headers = headers.set('X-Parse-Session-Token', resp.sessionToken)
            let params = new HttpParams().set('where', `{"user":{"__type":"Pointer","className":"_User","objectId":"${resp.objectId}"}}`);
            return zip(of(resp), this.http.get(urlPerson, {headers, params}))
         }),
         map(([sessionUser, person]: any[]) => ({
            person: person.results,
            user: sessionUser
         })),
         filter(result => result.person.length == 1),
         map(r => ({
            person: r.person[0],
            user: r.user
         }))
      );

      return await lastValueFrom(loginRequest) as IParseAuthResponse;
   }

   protected getCurrentUser(): Observable<User> {
      return of(this.currentUser);
   }

   protected authLogoutProvider(): Observable<void> {
      const baseUrl = `${AppSettings.apiURL}/logout`;
      const body = {};
      return this.http.post<void>(baseUrl, body).pipe(
         tap(() => this.router.navigate(['/login']))
      )
   }
}
