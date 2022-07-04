import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { BehaviorSubject, 
   Observable, 
   of, 
   zip, 
   throwError, 
   mergeMap,
   map, 
   pipe
} from 'rxjs'; // Creators
import { catchError, filter, tap  } from 'rxjs/operators'; // Operators

import { transformError } from '../_helpers/common';
import { Account } from '@app/core/_models/account';
import { CacheService } from './cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';


@Injectable({ providedIn: 'root' })
export abstract class AuthService extends CacheService {
   // Class Variables
   private getAndUpdateAccountIfAuthenticated = pipe(
      mergeMap( (user:any) => {
         const urlPerson = `${environment.apiURL}/classes/Person`;
         const urlRoles  = `${environment.apiURL}/roles`;
         // let headers = new HttpHeaders();
         // headers = headers.set('X-Parse-Session-Token', user.sessionToken)
         let paramsPerson = new HttpParams().set('where', `{"user":{"__type":"Pointer","className":"_User","objectId":"${user.objectId}"}}`);
         let paramsRoles = new HttpParams().set('where', `{"users":{"$inQuery":{"where":{"objectId":"${user.objectId}"},"className":"_User"}}}`);
         return zip(
                  of(user), 
                  this.http.get(urlPerson, { params: paramsPerson}), 
                  this.http.get(urlRoles, { params: paramsRoles})
               )
      }),
      map(([user, person, roles]: any[]) => {
         const rolesArray = roles.results.map((role:any) => role.name);
         return ({
                  user: user,
                  person: person.results[0],
                  roles: rolesArray
               });
      }),
      map( loginResponse => {
         let account = new Account(loginResponse);
         this.accountSubject.next(account);
         console.log(account);
         return account;
      })
      // catchError(transformError)
   );

   readonly accountSubject: BehaviorSubject<Account>;
   readonly account: Observable<Account>
   public rememberMe: boolean = false;

   constructor(
      private http: HttpClient,
      private router: Router
   ) {
      super();
      this.accountSubject = new BehaviorSubject<Account>(new Account());
      this.account = this.accountSubject.asObservable();
   }

   public get accountValue(): Account {
      return this.accountSubject.value;
   }

   // Class methods
   login(email: string, password: string): Observable<Account> {
      this.clearToken();

      const body = {
         username: email,
         password: password,
      };
      const baseUrl   = `${environment.apiURL}/login`;
      
      return this.http.post<Account>(baseUrl, body).pipe(
         tap({
            next: user => {
              // if authenticated then save token
              console.log('rememberme?: ', this.rememberMe)
              this.setToken(user.sessionToken);
            },
            error: error => {
              console.log('on error', error);
              return error;
            }
          }),
         this.getAndUpdateAccountIfAuthenticated
      );
   }

   logout() {
      const baseUrl = `${environment.apiURL}/logout`;
      const body = {};
      const logoutResponse$ = this.http.post<void>(baseUrl, body)
      logoutResponse$.subscribe({
         next: (res) => {
            this.accountSubject.next(new Account());
            this.router.navigate(['/login'])
         },
         error: (err) => {
            console.error(err)
            return throwError(() => new Error(err));
         },
         complete: () => this.clearToken()
      })

      return logoutResponse$;
   }

   // Methods for handlind token 
   public getToken(): string {
      return this.getItem('token') as string;
   }

   protected setToken(token: string) {
      this.setItem('token', token, this.rememberMe);
   }

   public clearToken() {
      this.removeItem('token');
   }

   validateSession() {
      const baseUrl   = `${environment.apiURL}/users/me`;  
      return this.http.get<Account>(baseUrl).pipe(
         this.getAndUpdateAccountIfAuthenticated
      );
   }

   personas() {
      const urlPerson = `${environment.apiURL}/classes/Person`;
      return this.http.get(urlPerson)
   }
}
