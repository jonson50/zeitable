import * as Parse from 'parse';
import { IProject } from './project';
// Interfaces
export interface IAccount {
   id: string | undefined;
   user: Parse.User | undefined;
   person: any;
   roles: Parse.Role[] | undefined;
   settings: Parse.Object<Parse.Attributes>[];
   projects: Parse.Object<Parse.Attributes>[] ;
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
   user: Parse.User | undefined;
   person: any | undefined;
   roles: Parse.Role[] | undefined;
   settings: any | undefined;
   projects: any | undefined;
   authenticated: boolean;

   constructor(response?: IBaseAccount) {
      this.user = response && response.user || undefined;
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

   public get fullName(): string {
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

export interface IEWorkingDay {
   date: string; // '2022-7-9' => "YYYY-MM-DD"
}

export interface IYearHolidays {
   date: string;
   name: string;
}
export interface ISettings {
   id: string;
   attributes: {
      active: boolean;
      carryOverHrsLastYear: number;
      exceptionWorkingDays: IEWorkingDay[];
      maxCompensatory: number;
      nightHours: {
         from: string;
         until: string;
      };
      user: Parse.User | undefined;
      workingDaysHours: {
         monday: number;
         tuesday: number;
         wednesday: number;
         thursday: number;
         friday: number;
         saturday: number;
         sunday: number;
      };
      workingHoursWeek: number;
      yearHolidays: IYearHolidays[];
   }
}

export class Settings {
   id: string | null;
   active: boolean;
   carryOverHrsLastYear: number;
   exceptionWorkingDays: IEWorkingDay[];
   maxCompensatory: number;
   nightHours: {
      from: string;
      until: string;
   };
   user: Parse.User | undefined;
   workingDaysHours: {
      monday: number;
      tuesday: number;
      wednesday: number;
      thursday: number;
      friday: number;
      saturday: number;
      sunday: number;
   };
   workingHoursWeek: number;
   yearHolidays: IYearHolidays[];

   constructor(setting?: ISettings) {
      this.id = setting && setting.id || null
      this.active = setting && setting.attributes && setting.attributes.active || false;
      this.carryOverHrsLastYear = setting && setting.attributes && setting.attributes.carryOverHrsLastYear || 0;
      this.exceptionWorkingDays = setting && setting.attributes && setting.attributes.exceptionWorkingDays || [];
      this.maxCompensatory = setting && setting.attributes && setting.attributes.maxCompensatory || 0;
      this.nightHours = setting && setting.attributes && setting.attributes.nightHours || { from: "22:00", until: "06:00" };
      this.user = setting && setting.attributes && setting.attributes.user || undefined;
      const wd = {
         monday: 8,
         tuesday: 8,
         wednesday: 8,
         thursday: 8,
         friday: 8,
         saturday: 0,
         sunday: 0
      };
      this.workingDaysHours = setting && setting.attributes && setting.attributes.workingDaysHours || wd;
      this.workingHoursWeek = setting && setting.attributes && setting.attributes.workingHoursWeek || 40;
      this.yearHolidays = setting && setting.attributes && setting.attributes.yearHolidays || [];
   }

}