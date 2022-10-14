import { time } from 'console';
import { IProject } from './project';
// Interface used accordin to Parse structure
export interface ITimeEntry {
   startTime: Date | null;
   endTime: Date | null;
   pause: number | null;
   homeOffice: boolean;
   project: Parse.Object | null;
   type: number | null;
   difference: number | null;
   settings: Parse.Object | null;
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
   active: boolean;
   opened: boolean;
   records: TimeEntry[];
   isHolliday: boolean;
}

export interface ITimeEntryForm {
   startTime: string;
   endTime: string;
   pause: string;
   homeOffice: boolean;
   project: any;
   comments: string;
}

export class DayRecord implements IDayRecord {
   date: Date = new Date();
   description: string | null = null;
   should: number | null = null;
   active: boolean = false;
   opened: boolean = false;
   records: TimeEntry[] = [];
   isHolliday: boolean = false;
   isAbsence: boolean = false;

   get ist(): string {
      let sum = 0;
      this.records.forEach(t => {
         sum = sum + t.totalTime;
      });
      return TimeEntry.numbertimeToStringtime(sum);
   }

   get is(): number {
      let sum = 0;
      this.records.forEach(t => {
         sum = sum + t.totalTime;
      });
      return sum;
   }

   get shouldInTime(): number {
      if (!this.should) return 0;
      return (this.should * 3600);
   }

   get overtime(): number {
      const over = this.is - this.shouldInTime;
      if(over <= 0) return 0;
      return over;
   }

   get overtimet():string {
      return TimeEntry.numbertimeToStringtime(this.overtime);
   }
}

export class TimeEntry {
   startTime: Date | null;
   endTime: Date | null;
   pause: number | null;
   homeOffice: boolean;
   project: Parse.Object | null;
   type: number = 0;
   difference: number;
   settings: Parse.Object | null;
   user: Parse.User | null;
   comments: string;
   totalTime: number = 0;
   _originalParseObject!: any;

   constructor(timeentry?: ITimeEntry) {
      this.startTime = (timeentry && timeentry.startTime)|| null;
      this.endTime = (timeentry && timeentry.endTime) || null;
      this.pause = (timeentry && timeentry.pause) || null;
      this.homeOffice = (timeentry && timeentry.homeOffice) || false;
      this.project = (timeentry && timeentry.project) || null;
      this.type = (timeentry && timeentry.type) || 0;
      this.difference = (timeentry && timeentry.difference) || 0;
      this.settings = (timeentry && timeentry.settings) || null;
      this.user = (timeentry && timeentry.user) || null;
      this.comments = (timeentry && timeentry.comments) || '';
      this.totalTime = (timeentry && timeentry.totalTime) || 0;
      this._originalParseObject = undefined;
   }

   patchParseValue(object: Parse.Object): void {
      this.startTime = object.attributes['startTime'];
      this.endTime = object.attributes['endTime'];
      this.pause = object.attributes['pause'];
      this.homeOffice = object.attributes['homeOffice'];
      this.project = object.attributes['project'];
      this.type = object.attributes['type'];
      this.difference = object.attributes['difference'];
      this.settings = object.attributes['settings'];
      this.user = object.attributes['user'];
      this.comments = object.attributes['comments'];
      this.totalTime = object.attributes['totalTime'];
      this._originalParseObject = object;
   }

   get formatedTotalTime(): string {
      return TimeEntry.numbertimeToStringtime(this.totalTime);
   }

   toParsePlatform() {
      return {
         startTime: this.startTime,
         endTime: this.endTime,
         pause: this.pause,
         homeOffice: this.homeOffice,
         project: this.project,
         type: this.type,
         difference: this.difference,
         settings: this.settings,
         user: this.user,
         comments: this.comments,
         totalTime: this.totalTime
      }
   }

   static dateToStringtime(date: Date | null): string {
      if (!date) return '';
      const _date = new Date(date);
      const _hrs = _date.getHours();
      const _mins = _date.getMinutes();
      let _hrsString = '0';
      let _minsString = '0';
      _hrsString =
         _hrs < 10 ? _hrsString.concat(_hrs.toString()) : _hrs.toString();
      _minsString =
         _mins < 10
            ? _minsString.concat(_minsString.toString())
            : (_minsString = _mins.toString());

      return `${_hrsString}:${_minsString}`;
   }

   static numbertimeToStringtime(time: number | null): string {
      if (!time) return '00:00';
      const _hrs = Math.floor(time / 3600);
      const _mins = (time % 3600) / 60;
      let _hrsString = '0';
      let _minsString = '0';
      _hrsString =
         _hrs < 10 ? _hrsString.concat(_hrs.toString()) : _hrs.toString();
      _minsString =
         _mins < 10
            ? _minsString.concat(_mins.toString())
            : (_minsString = _mins.toString());

      return `${_hrsString}:${_minsString}`;
   }

   static dateFromStringTime(date: Date, time: string): Date {
      const timeArray = time.split(":");
      let _date: Date = new Date(date);
      _date.setHours(Number(timeArray[0]));
      _date.setMinutes(Number(timeArray[1]));

      return _date;
   }

   static stringtimeToNumbertime(time: string): number {
      const pauseTimeArray = time.split(":");
      return (Number(pauseTimeArray[0]) * 3600) + (Number(pauseTimeArray[1]) * 60);
   }
}
