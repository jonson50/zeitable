export interface IYearHolidays {
  date: string;
  name: string;
}

export class Settings {
  year: number;
  carryOverHrsLastYear: number;
  exceptionWorkingDays: Date[];
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
  validityTimeEntry: number;
  yearHolidays: IYearHolidays[];
  private _originalParseObject!: Parse.Object | undefined;

  constructor() {
    this.year = new Date().getFullYear();
    this.carryOverHrsLastYear = 0;
    this.maxCompensatory = 0;
    this.nightHours = { from: "22:00", until: "06:00" };
    this.user = undefined;
    this.validityTimeEntry = 7;
    this.yearHolidays = [];
    this.workingDaysHours = {
      monday: 8, tuesday: 8, wednesday: 8, thursday: 8, friday: 8, saturday: 0, sunday: 0
    };
    this.exceptionWorkingDays = [];
    this._originalParseObject = undefined;
  }

  get originalParseObject(): Parse.Object | undefined {
    return this._originalParseObject;
  }

  toParsePlatform(): Object {
    
    return {
      carryOverHrsLastYear: this.carryOverHrsLastYear,
      exceptionWorkingDays: this.exceptionWorkingDays,
      maxCompensatory: this.maxCompensatory,
      nightHours: this.nightHours,
      validityTimeEntry: this.validityTimeEntry,
      workingDaysHours: this.workingDaysHours,
      year: this.year,
      yearHolidays: this.yearHolidays
    }
  }

  patchParseValue(setting: Parse.Object): void {
    this.year = setting.attributes['year'];
    this.carryOverHrsLastYear = setting.attributes['carryOverHrsLastYear'];
    this.maxCompensatory = setting.attributes['maxCompensatory'];
    this.nightHours = setting.attributes['nightHours'];
    this.user = setting.attributes['user'];
    this.validityTimeEntry = setting.attributes['validityTimeEntry'];
    this.yearHolidays = setting.attributes['yearHolidays'];
    this.exceptionWorkingDays = [];
    this.workingDaysHours = setting.attributes['workingDaysHours'];
    const exceptionDays = setting.attributes['exceptionWorkingDays'];
    exceptionDays.forEach((day: string) => {
      this.exceptionWorkingDays.push(new Date(day))
    })
    this._originalParseObject = setting;
  }
}