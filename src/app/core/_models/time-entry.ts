import { IProject } from "./project";

export interface ITimeEntry {
   id: string | null;
   startTime: Date | null;
   endTime: Date | null;
   pause: number | null;
   homeOffice: boolean;
   project: IProject | null;
   type: number | null;
   difference: number | null;
   settings: any | null;
   user: Parse.User | null;
   comments: string | null;
   totalTime: number | null;
}

export interface IWorkinDaysHours {
   monday: number;
   tuesday: number;
   wednesday: number;
   thursday: number;
   friday: number;
   saturday: number;
   sunday: number;
}

export interface IDayRecord {
   date: Date;
   description: string | null;
   should: number | null;
   is: number | null;
   active: boolean;
   opened: boolean;
   records: ITimeEntry[];
   isHolliday: boolean;
}

export class DayRecord implements IDayRecord {
   date: Date = new Date();
   description: string | null = null;
   should: number | null = null;
   is: number | null = null;
   active: boolean = true;
   opened: boolean = false;
   records: ITimeEntry[] = [];
   isHolliday: boolean = false;
}

export class TimeEntry implements ITimeEntry {
   id: string | null = null;
   startTime: Date | null = null;
   endTime: Date | null = null;
   pause: number | null = null;
   homeOffice: boolean = false;
   project: IProject | null = null;
   type: number | null = null;
   difference: number | null = null;
   settings: any | null = null;
   user: Parse.User | null = null;
   comments: string | null = null;
   totalTime: number | null = null;
}