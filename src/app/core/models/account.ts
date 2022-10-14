import * as Parse from 'parse';
import { IProject } from './project';
// Interfaces
export interface IAccount {
   id: string | undefined;
   user: Parse.User | null;
   person: any;
   roles: Parse.Role[] | undefined;
   settings: Parse.Object<Parse.Attributes>[];
   projects: Parse.Object<Parse.Attributes>[];
   authenticated: boolean
}

export interface IBaseAccount {
   user: Parse.User | undefined;
   person: any | undefined;
   roles: Parse.Role[] | undefined;
   settings: any | undefined;
   projects: any[] | undefined;
}

// Classes
export class Account implements IAccount {
   id: string | undefined;
   user: Parse.User | null;
   person: any | undefined;
   roles: Parse.Role[] | undefined;
   settings: any | undefined;
   projects: any | undefined;
   authenticated: boolean;

   constructor(response?: IBaseAccount) {
      this.user = response && response.user || null;
      this.id = response && response.user && response.user.id || undefined;
      this.person = response && response.person || undefined;
      this.roles = response && response.roles || undefined;
      this.settings = response && response.settings || undefined;
      this.projects = response && response.projects || undefined;
      this.authenticated = (response && response.user) ? true : false;
   }

   // static Build(user: IAccount) {
   //    let newUser = new User();
   //    if(!user) {
   //       return newUser;
   //    }
   //    newUser.id       = user.id;
   //    newUser.email     = user.email;
   //    newUser.userStatus= user.userStatus;
   //    newUser.role      = user.role;
   //    newUser.person    = user.person;
   //    return newUser;
   // }

   get fullName(): string {
      if (!this.person.attributes.name) {
         return ''
      }
      return this.person.attributes.name;
      // if(this.person.name.middle) {
      //    return `${this.person.name.first} ${this.person.name.middle} ${this.person.name.last}`
      // }

      // return `${this.person.name.first} ${this.person.name.last}`
   }

   // toJSON(): Object {
   //    const serialized = Object.assign(this)
   //    delete serialized.id
   //    delete serialized.fullName
   //    return serialized
   // }
}
