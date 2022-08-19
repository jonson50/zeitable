import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Account, Settings } from '@app/core/_models/account';
import { IProject, Project } from '@app/core/_models/project';
import { DayRecord, IWorkinDaysHours, TimeEntry } from '@app/core/_models/time-entry';
import { AuthService } from '@app/core/_services';
import { RecordsService } from '../services/records.service';
import { RecordEntryDialogComponent } from '../components/record-entry-dialog/record-entry-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit {
  daysInMonth: Date[] = [];
  selectedDate!: Date;
  account!: Account;
  recordDays: DayRecord[] = [];
  assignedProjects: Project[] = [];

  constructor(
    private authService: AuthService,
    private recordsService: RecordsService,
    private dialog: MatDialog,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.authService.account$.subscribe(
      account => {
        this.account = account;
        const parseProjects:IProject[] = account.projects;
        parseProjects.forEach((p) =>{
          this.assignedProjects.push(new Project(p));
        });
      }
    );
    this.spinnerService.show();
    this.recordsService.timeEntries.subscribe({
      next: resp => {
        console.log(resp)
        //Using the TimeEntry records to fill up the calendar table.
        this.recordDays = this.getDaysInMonth(this.selectedDate);
      },
      error: error => console.error(error),
      complete: () => {
        this.spinnerService.hide();
      }
    });
  }
  /**
   * @param {int} selectedDate current date containing the month from which the days are taken.
   * @return {Date[]} List with date objects for each day of the month
   */
  getDaysInMonth(selectedDate: Date): DayRecord[] {
    let date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    let days: DayRecord[] = [];
    const wdh: IWorkinDaysHours = this.account.settings.get("workingDaysHours") as IWorkinDaysHours;
    const workingDaysHours = [wdh.sunday, wdh.monday, wdh.tuesday, wdh.wednesday, wdh.thursday, wdh.friday, wdh.saturday];
    const yearHolidays: any[] = this.account.settings.get("yearHolidays");
    const exceptionWorkingDays: any[] = this.account.settings.get("exceptionWorkingDays");

    while (date.getMonth() === selectedDate.getMonth()) {
      let dayRecord: DayRecord = new DayRecord();
      dayRecord.date = new Date(date);
      //handling data when is sunday
      if (date.getDay() == 0 && workingDaysHours[date.getDay()] == 0) {
        // if it is Sunday and it is not allow to work on Sundays
        dayRecord.description = "Sunday";
        dayRecord.should = null;
        dayRecord.is = null;
        dayRecord.active = false;
        dayRecord.opened = false;
        dayRecord.isHolliday = true;
      }
      if (date.getDay() == 0 && workingDaysHours[date.getDay()] != 0) {
        // if it is Sunday and it is ALLOW to work on Sundays
        dayRecord.description = "Working Sunday";
        dayRecord.should = workingDaysHours[date.getDay()];
        dayRecord.is = null;
        dayRecord.active = true;
        dayRecord.opened = false;
        dayRecord.isHolliday = true;
      }
      if (date.getDay() != 0 && workingDaysHours[date.getDay()] == 0) {
        // if it is any other week day and is NOT ALLOW to work on that day
        dayRecord.description = "Not allow to work";
        dayRecord.should = null;
        dayRecord.is = null;
        dayRecord.active = false;
        dayRecord.opened = false;
        dayRecord.isHolliday = false;
      }
      const isHolliday = this.findingDateInArray(yearHolidays, date);
      if (date.getDay() != 0 && workingDaysHours[date.getDay()] != 0 && isHolliday) {
        // if it is any other week day, it is ALLOW to work on that day
        // but it's holliday
        dayRecord.description = isHolliday.name;
        dayRecord.should = null;
        dayRecord.is = null;
        dayRecord.active = false;
        dayRecord.opened = false;
        dayRecord.isHolliday = true;
      }
      if (date.getDay() != 0 && workingDaysHours[date.getDay()] != 0 && !isHolliday) {
        // a normal working day
        dayRecord.description = "Working Day";
        dayRecord.should = workingDaysHours[date.getDay()];
        dayRecord.is = null;
        dayRecord.active = true;
        dayRecord.opened = this.isDateValid(date) && (date.getTime() <= this.selectedDate.getTime());
        dayRecord.isHolliday = false;
      }
      // finding out if there are any other authorized working day (initially didn't allow it)
      const isExceptionWorkingDay = this.findingDateInArray(exceptionWorkingDays, date);
      if (isExceptionWorkingDay) {
        dayRecord.description = "Exception Working Day";
        dayRecord.should = workingDaysHours[date.getDay()];
        dayRecord.is = null;
        dayRecord.active = true;
        dayRecord.opened = this.isDateValid(date) && (date.getTime() <= this.selectedDate.getTime());
      }

      days.push(dayRecord);
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
  /**
   * @param {int} index value to be either added or substracted from current month value
   * from current Month shown, get any other month to be displayed
   * according to the index selected
   */
  selectAnotherMonth(index: number): void {
    const currentDate = new Date();
    this.selectedDate.setMonth(this.selectedDate.getMonth() + index);
    this.selectedDate = new Date(this.selectedDate);
    if (this.selectedDate > currentDate) {
      this.selectedDate = currentDate;
      return;
    }
    this.recordDays = this.getDaysInMonth(this.selectedDate);
  }
  /**
   *
   * @param array array of dates in which a date is looking for
   * @param date Date beeing found inside the array
   * @returns the date founded or undefined if not
   */
  findingDateInArray(array: any, date: Date): any {
    return array.find((d: any) => {
      let anyDay = new Date(d["date"]);
      const savedHolliday = `${anyDay.getFullYear()}+${anyDay.getDate()}+${anyDay.getDay()}`;
      const currentIterationDay = `${date.getFullYear()}+${date.getDate()}+${date.getDay()}`;
      return savedHolliday == currentIterationDay;
    });
  }
  /**
   * verify if it is valid according to the period of validity (from settings)
   * @param date date to be validated
   * @returns true if date is valid otherwise false
   */
  isDateValid(date: Date): boolean {
    const periodOfValidity = 5; // days ->> should come from settings 5, 10, 15 or 20
    let borderDate = new Date();
    borderDate.setDate(this.selectedDate.getDate() - periodOfValidity);
    const borderDateWeek = this.getWeekNumberFromDate(borderDate);
    const requestedDateWeek = this.getWeekNumberFromDate(date);

    return requestedDateWeek >= borderDateWeek;
  }
  /**
   * Helper function to get the week number from a given date
   * @param date date to find the according week number that belongs to.
   * @returns the week number from the year according to date
   */
  getWeekNumberFromDate(date: Date): number {
    const startDate = new Date(date.getFullYear(), 0, 1);
    let days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

    return Math.ceil(days / 7);
  }

  addRecord(index: number): void {
    const recordDialogRef = this.dialog.open(RecordEntryDialogComponent, {
      data: {
        recordId: "",
        date:this.recordDays[index].date
      }
    });

    recordDialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
    /* const test = {
      id: "",
      startTime: new Date(),
      endTime: new Date(),
      pause: 1,
      homeOffice: false,
      totalTime: 1,
      project: {
        id: "",
        projectParent: null,
        code: "",
        name: "",
        active: true
      },
      settings: null,
      user: this.account.user,
      type: 1,
      difference: 1,
      comments: "",
    } as ITimeEntry
    this.recordDays[index].records.push(test); */
  }
}
