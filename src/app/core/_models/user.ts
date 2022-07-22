import { IParseAuthResponse } from "src/app/core/_models/account"

export interface IParsePerson {
   name: string;
   age: number;
   objectId: string;
   user: {
      objectId: string
   }
   picture?: string
   dateOfBirth?: Date | null | string
   address?: {
      line1: string
      line2?: string
      city: string
      state: string
      zip: string
   }
   phone?: string
}

export interface IParseUser {
   objectId: string;
   email: string;
   username: string;
   sessionToken: string;
}

export interface IName {
   first: string
   middle?: string
   last: string
}

export interface IPerson {
   id: string
   name: string
   picture: string
   dateOfBirth: Date | null | string
   address: {
      line1: string
      line2?: string
      city: string
      state: string
      zip: string
   }
   phone: string
}

export interface IUser {
   id: string
   email: string
   userStatus: boolean
   role: string
   person: IPerson
   readonly fullName?: string
}

export class Person implements IPerson {
   public id: string;
   public name: string;
   public picture: string
   public dateOfBirth: Date | null | string
   public address: {
      line1: string
      line2?: string
      city: string
      state: string
      zip: string
   }
   public phone: string

   constructor(person?: IParsePerson) {
      this.id = person && person.objectId || '';
      this.name = person && person.name || ''
      this.picture = person && person.picture || '';
      this.address = person && person.address || {
         line1: '',
         city: '',
         state: '',
         zip: ''
      };
      this.phone = person && person.phone || '';
      if (person && typeof person.dateOfBirth === 'string') {
         this.dateOfBirth = new Date(person.dateOfBirth)
      } else {
         this.dateOfBirth = person?.dateOfBirth ?? null
      }
   }
}

export class User implements IUser {
   public id: string
   public email: string
   public userStatus: boolean
   public role: string
   public person: IPerson

   constructor(user?: IParseAuthResponse) {
      this.id = user && user.user.objectId || '';
      this.email = user && user.user.email || '';
      this.userStatus = user ? true : false;
      this.role = '';
      this.person = (user && user.person) ? new Person(user.person) : new Person();
   }

   static Build(user: IUser) {
      let newUser = new User();
      if (!user) {
         return newUser;
      }
      newUser.id = user.id;
      newUser.email = user.email;
      newUser.userStatus = user.userStatus;
      newUser.role = user.role;
      newUser.person = user.person;
      return newUser;
   }

   public get fullName(): string {
      if (!this.person.name) {
         return ''
      }
      return this.person.name;
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
