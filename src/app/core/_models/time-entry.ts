import { IProject } from "./project";
// Interface used accordin to Parse structure
export interface ITimeEntry {
   id: string | null;
   date: Date | null;
   attributes: {
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
   records: TimeEntry[];
   isHolliday: boolean;
}

export class DayRecord implements IDayRecord {
   date: Date = new Date();
   description: string | null = null;
   should: number | null = null;
   is: number | null = null;
   active: boolean = true;
   opened: boolean = false;
   records: TimeEntry[] = [];
   isHolliday: boolean = false;
}

export class TimeEntry {
   id: string | null;
   date: Date;
   startTime: Date | null;
   endTime: Date | null;
   pause: number | null;
   homeOffice: boolean;
   project: IProject | null;
   type: number = 0;
   difference: number;
   settings: any | null;
   user: Parse.User | null;
   comments: string | null;
   totalTime: number = 0;

   constructor(timeentry?: ITimeEntry) {
      this.id = timeentry && timeentry.id || null;
      this.date = new Date();
      this.startTime = timeentry && timeentry.attributes && timeentry.attributes.startTime || null;
      this.endTime = timeentry && timeentry.attributes && timeentry.attributes.endTime || null;
      this.pause = timeentry && timeentry.attributes && timeentry.attributes.pause || 0;
      this.homeOffice = timeentry && timeentry.attributes && timeentry.attributes.homeOffice || false;
      this.project = timeentry && timeentry.attributes && timeentry.attributes.project || null;
      this.type = timeentry && timeentry.attributes && timeentry.attributes.type || 0;
      this.difference = timeentry && timeentry.attributes && timeentry.attributes.difference || 0;
      this.settings = timeentry && timeentry.attributes && timeentry.attributes.settings || null;
      this.user = timeentry && timeentry.attributes && timeentry.attributes.user || null;
      this.comments = timeentry && timeentry.attributes && timeentry.attributes.comments || null;
      this.totalTime = timeentry && timeentry.attributes && timeentry.attributes.totalTime || 0;
   }
}