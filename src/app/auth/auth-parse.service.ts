import { Injectable } from '@angular/core';
import decode from 'jwt-decode';
import { BehaviorSubject, Observable, pipe, throwError } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

import { transformError } from '../common/common';
import { IUser, User, IParsePerson, IParseUser } from '../user/user/user';
import { Role } from './auth.enum';
import { CacheService } from './cache.service';

export interface IAuthService {
   readonly authStatus$: BehaviorSubject<IAuthStatus>;
   readonly currentUser$: BehaviorSubject<IUser>;
   login(email: string, password: string): Observable<void>;
   logout(clearToken?: boolean): void;
   getToken(): string;
}

export interface IAuthStatus {
   isAuthenticated: boolean;
   userRole: Role;
   userId: string;
}

export interface IParseAuthResponse {
   person: IParsePerson;
   user: IParseUser;
}

export const defaultAuthStatus: IAuthStatus = {
   isAuthenticated: false,
   userRole: Role.None,
   userId: '',
};


@Injectable()
export abstract class AuthService extends CacheService implements IAuthService {
   // Class Variables
   private getAndUpdateUserIfAuthenticated = pipe(
      filter((status: IAuthStatus) => status.isAuthenticated),
      mergeMap(() => this.getCurrentUser()),
      map((user: IUser) => this.currentUser$.next(user)),
      catchError(transformError)
   );

   readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus);
   readonly currentUser$ = new BehaviorSubject<IUser>(new User());
   protected readonly resumeCurrentUser$ = this.authStatus$.pipe(
      this.getAndUpdateUserIfAuthenticated
   );

   constructor() {
      super();
      if(this.getStatus().isAuthenticated && this.getUser().id) {
         this.authStatus$.next(this.getStatus());
         this.currentUser$.next(this.getUser())
      }
   }

   // Protected Abstract Methods
   protected abstract authProvider(
      email: string,
      password: string
   ): Observable<IParseAuthResponse>;
   // protected abstract transformJwtToken(token: unknown): IAuthStatus;
   protected abstract getCurrentUser(): Observable<User>;

   // Class methods
   login(email: string, password: string): Observable<void> {
      this.clearToken();

      const loginResponse$ = this.authProvider(email, password).pipe(
         map((value: IParseAuthResponse) => {
            console.log(value)
            this.setToken(value.user.sessionToken);
            this.setUser(new User(value))
            const status = {
               isAuthenticated: true,
               userRole: Role.None,
               userId: value.user.objectId,
            } as IAuthStatus;
            this.setStatus(status);
            return status;
         }),
         tap((status) => this.authStatus$.next(status)),
         this.getAndUpdateUserIfAuthenticated
      );

      loginResponse$.subscribe({
         error: (err) => {
            console.error(err)
            this.logout();
            return throwError(() => new Error(err));
         },
      });

      return loginResponse$;
   }

   logout(clearToken?: boolean) {
      if (clearToken) {
         this.clearToken();
         this.clearStatus();
         this.clearUser();
      }
      this.authStatus$.next(defaultAuthStatus);
   }

   getToken(): string {
      return this.getItem('token') ?? '';
   }

   // Protected Methods
   protected setToken(token: string) {
      this.setItem('token', token);
   }

   protected clearToken() {
      this.removeItem('token');
   }

   protected setStatus(status:IAuthStatus) {
      this.setItem('status', status);
   }

   protected clearStatus() {
      this.removeItem('status');
   }

   protected getStatus():IAuthStatus {
      return this.getItem('status')? this.getItem('status') as IAuthStatus : defaultAuthStatus;
   }

   protected setUser(status:IUser) {
      this.setItem('user', status);
   }

   protected clearUser() {
      this.removeItem('user');
   }

   protected getUser():IUser {
      return this.getItem('user')? this.getItem('user') as IUser : new User();
   }
}
