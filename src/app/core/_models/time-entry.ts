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
  is: number | null;
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
  is: number | null = null;
  active: boolean = true;
  opened: boolean = false;
  records: TimeEntry[] = [];
  isHolliday: boolean = false;
}

export class TimeEntry {
  date: Date;
  startTime: Date | null;
  endTime: Date | null;
  pause: number | null;
  homeOffice: boolean;
  project: Parse.Object | null;
  type: number = 0;
  difference: number;
  settings: Parse.Object | null;
  user: Parse.User | null;
  comments: string | null;
  totalTime: number = 0;

  constructor(timeentry?: ITimeEntry) {
    this.startTime = (timeentry && timeentry.startTime) || null;
    this.endTime = (timeentry && timeentry.endTime) || null;
    this.pause = (timeentry && timeentry.pause) || null;
    this.homeOffice = (timeentry && timeentry.homeOffice) || false;
    this.project = (timeentry && timeentry.project) || null;
    this.type = (timeentry && timeentry.type) || 0;
    this.difference = (timeentry && timeentry.difference) || 0;
    this.settings = (timeentry && timeentry.settings) || null;
    this.user = (timeentry && timeentry.user) || null;
    this.comments = (timeentry && timeentry.comments) || null;
    this.totalTime = (timeentry && timeentry.totalTime) || 0;
    this.date =
      timeentry && timeentry.startTime
        ? new Date(
            timeentry.startTime.getFullYear(),
            timeentry.startTime.getMonth(),
            timeentry.startTime.getDate()
          )
        : new Date();
  }

  get formatedTotalTime(): string {
    return TimeEntry.numbertimeToStringtime(this.totalTime);
  }

  toFormData() {
    return {
      startTime: TimeEntry.stringTimeFromDate(this.startTime),
      endTime: TimeEntry.stringTimeFromDate(this.endTime),
      pause: TimeEntry.numbertimeToStringtime(this.pause),
      homeOffice: this.homeOffice,
      project: this.project,
      comments: this.comments,
    };
  }

  fetchFromFormValue(values: ITimeEntryForm): void {
    if (values.startTime) this.startTime = TimeEntry.dateFromStringTime(this.date, values.startTime);
    if (values.endTime) this.endTime = TimeEntry.dateFromStringTime(this.date, values.endTime);
    if (values.pause) this.pause = TimeEntry.stringtimeToNumbertime(values.pause);
    if (values.homeOffice) this.homeOffice = values.homeOffice;
    if (values.project) this.project = values.project;
    if (values.comments) this.comments = values.comments;
  }

  static stringTimeFromDate(date: Date | null): string {
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
    if (!time) return '';
    const _hrs = Math.floor(time / 3600);
    const _mins = (time % 3600) / 60;
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

  static dateFromStringTime(date: Date, time:string):Date {
    const timeArray = time.split(":");
    let _date: Date = new Date(date);
    _date.setHours(Number(timeArray[0]));
    _date.setMinutes(Number(timeArray[1]));

    return _date;
  }

  static stringtimeToNumbertime(time:string): number {
    const pauseTimeArray = time.split(":");
    return (Number(pauseTimeArray[0])*3600) + (Number(pauseTimeArray[1])*60);
  }
}
