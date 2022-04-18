// Interfaces
export interface IParseUser {
   objectId: string;
   email: string;
   username: string;
   sessionToken: string;
}

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

export interface IRole {
   name: string
}

export interface IParseAuthResponse {
   user: IParseUser
   person: IParsePerson
   roles: IRole[]
}
// Interfaces for app
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

export interface IAccount {
   id: string
   email: string
   username: string
   sessionToken: string
   person: IPerson
   roles: IRole[]
   authenticated: boolean
}

// Classes
export class Role implements IRole {
   public name: string;

   constructor(role?: IRole) {
      this.name = role && role.name || '';
   }
}
export class Person implements IPerson {
   public id: string ;
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
      this.id          =  person && person.objectId || '';
      this.name         =  person && person.name || ''
      this.picture      =  person && person.picture || '';
      this.address      =  person && person.address || {
                                 line1: '',
                                 city: '',
                                 state: '',
                                 zip: ''
                              };
      this.phone        =  person && person.phone || '';
      if(person && typeof person.dateOfBirth === 'string') {
         this.dateOfBirth = new Date(person.dateOfBirth)
      } else {
         this.dateOfBirth  =  person?.dateOfBirth ?? null
      }
   }
}

export class Account implements IAccount {
   public id: string
   public email: string
   public username: string
   public sessionToken: string
   public roles: IRole[]
   public person: IPerson
   public authenticated: boolean;

   constructor(response?: IParseAuthResponse){
      this.id        = response && response.user.objectId || '';
      this.email     = response && response.user.email || '';
      this.username  = response && response.user.username || '';
      this.sessionToken = response && response.user.sessionToken || '';
      this.roles     = response && response.roles || [];
      this.person    = (response && response.person) ? new Person(response.person) : new Person();
      this.authenticated = (response && response.person) ? true : false;
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

      public get fullName(): string {
         if(!this.person.name) {
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