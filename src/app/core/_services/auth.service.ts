import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as Parse from 'parse';
import { BehaviorSubject, Observable } from 'rxjs'; // Creators
import { Account, IBaseAccount } from '@app/core/_models/account';
import { environment } from '@environments/environment';
import { CacheService } from './cache.service';


@Injectable({ providedIn: 'root' })
export abstract class AuthService extends CacheService {
   // Variables
   private accountSubject: BehaviorSubject<Account>;
   readonly account$: Observable<Account>
   rememberMe: boolean = false;

   constructor(
      private router: Router
   ) {
      super();
      this.accountSubject = new BehaviorSubject<Account>(new Account());
      this.account$ = this.accountSubject.asObservable();

      Parse.initialize(environment.APP_ID, environment.JS_KEY);
      (Parse as any).serverURL = environment.apiURL;
   }

   // Class methods
   /**
    * Method used for making a Login to the app
    * @param email parameter used as username while logging in
    * @param password parameter that contains the password for logging in
    * @returns return a Promise ensuring the current Account with all data required 
    */
   async login(email: string, password: string): Promise<Account> {
      this.clearToken();
      const user = await Parse.User.logIn(email, password);
      const account = await this.fillingAccount(user);

      return account;
   }

   logout(): void {
      Parse.User.logOut()
         .then(
            () => {
               this.accountSubject.next(new Account());
            },
            error => console.error(error)
         )
         .finally(
            () => {
               this.clearToken();
               this.router.navigate(['/login']);
            }
         )
   }

   /* GET and SET Methods for the service  */
   get token(): string {
      return this.getItem('token') as string;
   }

   protected set token(token: string) {
      this.setItem('token', token, this.rememberMe);
   }

   get accountValue(): Account {
      return this.accountSubject.value;
   }
   /**
    * This method clear the session token inside the Session Storage
    */
   clearToken() {
      this.removeItem('token');
   }
   /**
    * @param {string} token session to be validated
    * @return {Promise} true or false according to result
    * */
   async isSessionValid(token: string): Promise<Account> {
      const user = await Parse.User.become(token);
      const account = await this.fillingAccount(user);

      return account;
   }
   /**
    * @param {Parse.User} user 
    * @returns an Accoun Promise with all user data.
    */
   async fillingAccount(user: Parse.User): Promise<Account> {
      this.removeItem(`Parse/${environment.APP_ID}/currentUser`);
      this.removeItem(`Parse/${environment.APP_ID}/installationId`);
      // getting person for the authenticated user.
      const Person = Parse.Object.extend("Person");
      const person = await new Parse.Query(Person).equalTo("user", user).first();
      if (person === undefined) return Promise.reject(new Error('There is not Person associated'));
      // Getting roles for authenticated user.
      const roles = await new Parse.Query(Parse.Role).equalTo('users', user).find()
      // getting the current settings for the user
      const query = new Parse.Query("Setting");
      query.equalTo("user", user);
      query.equalTo("year", new Date().getFullYear()); // get Settings for current year and active
      query.equalTo("active", true);
      query.descending("updatedAt");
      const settings = await query.first();
      // getting the current projects for the user
      const projects = await new Parse.Query("Project").equalTo('users', user).ascending("code").find()
      // setting session token for app
      this.token = user.attributes['sessionToken'];
      // creating new Account for app
      const baseAccount:IBaseAccount = {
         user: user,
         person: person,
         roles: roles,
         settings: settings,
         projects: projects,
      } as IBaseAccount
      let account = new Account(baseAccount);
      this.accountSubject.next(account);

      return account;
   }
}
