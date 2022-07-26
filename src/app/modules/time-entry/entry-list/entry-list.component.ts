import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Account } from '@app/core/models/account';
import {
   DayRecord,
   IWorkinDaysHours,
   TimeEntry,
} from '@app/core/models/time-entry';
import { AuthService } from '@app/core/services';
import { RecordsService } from '../services/records.service';
import { RecordEntryDialogComponent } from '../components/record-entry-dialog/record-entry-dialog.component';
import { SimpleDialogComponent } from '@app/core/utils/simple-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-entry-list',
   templateUrl: './entry-list.component.html',
   styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit, OnDestroy {
   isAllRecordsReady: boolean = false;
   isSettingNoValid: boolean = false;
   account!: Account;
   recordDays: DayRecord[] = [];
   recordDaysMonth: DayRecord[] = [];
   records: Parse.Object[] = [];
   yearHolidays = [];
   selectedMonthYear!: Date; // This should be the first date of valid date, if implemented
   lastValidEntryDate!: Date; // Date of the last valid EntryTime
   firstValidDate: Date = new Date(2022, 0, 1); // => Should come from settings
   lastValidDate: Date = new Date(2022, 11, 31); // => should come from settings
   today = new Date(2022, 3, 7);
   headInfo = {
      workedHrs: '00',
      monthOvertime: '00',
      totalOvertime: '00'
   };

   //Subscriptions
   hollidaysSubscription!: Subscription;
   deleteTimeEntrySubscription!: Subscription;

   constructor(
      private authService: AuthService,
      private recordsService: RecordsService,
      private dialog: MatDialog,
      private spinnerService: NgxSpinnerService
   ) { }

   ngOnInit(): void {
      this.account = this.authService.accountValue;
      if (this.account.settings) {
         const zone = this.account.settings.get('zone'); // => a valid settings should be verified in order to inform client to contact admin

         this.spinnerService.show();
         this.hollidaysSubscription = this.recordsService.getHollidays(zone).subscribe({
            next: hollidays => {
               this.yearHolidays = hollidays.get('days');

               this.loadRecords();
            },
            error: error => {
               console.error(error);
            }
         });
      } else {
         this.isSettingNoValid = true;
      }
   }
   /**
    * Method to get all TimeEntry records from server
    */
   loadRecords(): void {
      this.recordsService.timeEntries().then(
         result => {
            this.records = result;
            let lastRecord = this.records[this.records.length - 1];
            if (lastRecord) {
               const lastRecordDate = lastRecord.get('startTime');
               this.lastValidEntryDate = new Date(lastRecordDate.getFullYear(), lastRecordDate.getMonth(), lastRecordDate.getDate() + 1);
               this.selectedMonthYear = new Date(lastRecordDate.getFullYear(), lastRecordDate.getMonth());
            } else {
               // This should be the initial valid data from settings
               this.selectedMonthYear = new Date(
                  this.account.settings.get('year'),
                  0 // January
               );
               this.lastValidEntryDate = new Date(this.selectedMonthYear);
            }
            //this.lastValidEntryDate = new Date(2022, 0, 29); // TO DELETE
            //this.calendarInit(this.selectedMonthYear);
            //Using the TimeEntry records to fill up the calendar table.
            this.updateDailyRecords();
            this.dailyRecordsMonth(this.selectedMonthYear);
            this.isAllRecordsReady = true;
         },
         error => { console.error(error) }
      ).finally(
         () => { this.spinnerService.hide(); }
      );
   }
   /**
    * @return {Date[]} List with date objects for each day of the month
    */
   updateDailyRecords(): void {
      let totalOvertime = 0;
      let firstDate: Date;
      let lastDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1);

      if (this.records) {
         const d = this.records[0].get('startTime');
         firstDate = new Date(d.getFullYear(), d.getMonth());
      } else {
         firstDate = new Date(this.selectedMonthYear.getFullYear(), this.selectedMonthYear.getMonth());
      }

      this.recordDays = [];
      while (firstDate.getTime() < lastDate.getTime()) {
         let dayRecord: DayRecord = new DayRecord();
         dayRecord.date = new Date(firstDate);
         this.recordDays.push(dayRecord);
         firstDate.setDate(firstDate.getDate() + 1);
      }
      // Iterating every single Record
      this.recordDays.forEach(dayRecord => {
         dayRecord.records = [];
         let workingDaysHours: any[] = [];
         let exceptionWorkingDays: any[] = [];
         let isExceptionWorkingDay = false;
         // iterating records to sort them according to date
         for (let index = 0; index < this.records.length; index++) {
            // Getting all setting used for the record
            const setting = this.records[index].get('settings');
            const wdh: IWorkinDaysHours = setting.get('workingDaysHours') as IWorkinDaysHours;
            workingDaysHours = [
               wdh.sunday, wdh.monday, wdh.tuesday, wdh.wednesday, wdh.thursday, wdh.friday, wdh.saturday,
            ];
            // const yearHolidays: any[] = this.account.settings.get('yearHolidays');
            exceptionWorkingDays = setting.get('exceptionWorkingDays');
            const _startTime = new Date(this.records[index].get('startTime'));
            if (dayRecord.date.toLocaleDateString() === _startTime.toLocaleDateString()) {
               switch (this.records[index].get('type')) {
                  case 2:
                     dayRecord.description = 'Vacations';
                     dayRecord.isAbsence = true;
                     break;
                  case 3:
                     dayRecord.description = 'Illnes';
                     dayRecord.isAbsence = true;
                     break;
                  case 4:
                     dayRecord.description = 'Compensatory';
                     dayRecord.isAbsence = true;
                     break
                  default:
                     let record = new TimeEntry();
                     record.patchParseValue(this.records[index]);
                     dayRecord.records.push(record);
               }
            }
         }
         // Configuring every single record to display
         if (workingDaysHours[dayRecord.date.getDay()] == 0 || dayRecord.isAbsence) {
            // Days here are NOT allow to work
            if (!dayRecord.isAbsence) {
               switch (dayRecord.date.getDay()) {
                  case 0:
                     dayRecord.description = 'Sunday';
                     dayRecord.isHolliday = true;
                     break;
                  case 6:
                     dayRecord.description = 'Saturday';
                     break;
                  default:
                     dayRecord.description = 'Not allow to work';
               }
            }
            if (this.dateToISOString(dayRecord.date) == this.dateToISOString(this.lastValidEntryDate)) {
               this.lastValidEntryDate.setDate(this.lastValidEntryDate.getDate() + 1);
            }
            /* HERE TO HANDLE THE EXCEPTIION WORKING DAYS */
            isExceptionWorkingDay = this.findingDateInArray(exceptionWorkingDays, dayRecord.date);
         }

         if (workingDaysHours[dayRecord.date.getDay()] != 0 || isExceptionWorkingDay) {
            // Days here are allow to work
            switch (dayRecord.date.getDay()) {
               case 0:
                  dayRecord.description = isExceptionWorkingDay ? 'Exception Working Sunday' : 'Working Sunday';
                  dayRecord.isHolliday = true;
                  break;
               case 6:
                  dayRecord.description = isExceptionWorkingDay ? 'Exception Working Saturday' : 'Working Saturday';
                  break;
               default:
                  dayRecord.description = isExceptionWorkingDay ? 'Exception Working Day' : 'Working Day';
            }
            if (dayRecord.date.getTime() <= this.lastValidEntryDate.getTime() &&
               dayRecord.date.getTime() <= this.today.getTime()) {
               dayRecord.active = true;
               dayRecord.should = workingDaysHours[dayRecord.date.getDay()];
               // Validating period of TimeEntry activation
               //let lowerValidLimitDate = new Date(this.lastValidEntryDate);
               let lowerValidLimitDate = new Date(this.today);
               let counter = 0;
               switch (this.account.settings.get('validityTimeEntry')) {
                  case 7:  // Default 7 days
                     while (counter < 1) {
                        lowerValidLimitDate.setDate(lowerValidLimitDate.getDate() - 1);
                        if (lowerValidLimitDate.getDay() == 0) {
                           counter++;
                        }
                     }
                     lowerValidLimitDate.setDate(lowerValidLimitDate.getDate() + 1);
                     if (dayRecord.date.getTime() >= lowerValidLimitDate.getTime() &&
                        dayRecord.date.getTime() <= this.lastValidEntryDate.getTime()) {
                        dayRecord.opened = true;
                     }
                     break;
                  case 14:
                     while (counter < 2) {
                        lowerValidLimitDate.setDate(lowerValidLimitDate.getDate() - 1);
                        if (lowerValidLimitDate.getDay() == 0) {
                           counter++;
                        }
                     }
                     lowerValidLimitDate.setDate(lowerValidLimitDate.getDate() + 1);
                     if (dayRecord.date.getTime() >= lowerValidLimitDate.getTime() &&
                        dayRecord.date.getTime() <= this.lastValidEntryDate.getTime()) {
                        dayRecord.opened = true;
                     }
                     break;
                  case 20:
                     while (counter < 3) {
                        lowerValidLimitDate.setDate(lowerValidLimitDate.getDate() - 1);
                        if (lowerValidLimitDate.getDay() == 0) {
                           counter++;
                        }
                     }
                     lowerValidLimitDate.setDate(lowerValidLimitDate.getDate() + 1);
                     if (dayRecord.date.getTime() >= lowerValidLimitDate.getTime() &&
                        dayRecord.date.getTime() <= this.lastValidEntryDate.getTime()) {
                        dayRecord.opened = true;
                     }
                     break;
                  case 30:
                     dayRecord.opened = true;
                     break;
               }
               /* TODO: verify if this is valid */
               if (dayRecord.date.getTime() < lowerValidLimitDate.getTime()) dayRecord.opened = true;
            }
         }
         // Over Labeling the Hollidays of the year
         this.yearHolidays.forEach(day => {
            const date = new Date(day['date']);
            if (this.dateToISOString(date) == this.dateToISOString(dayRecord.date)) {
               dayRecord.description = day['name'];
               dayRecord.isHolliday = true;
            }
         });
         totalOvertime += dayRecord.overtime;
      });
      this.headInfo.totalOvertime = TimeEntry.numbertimeToStringtime(totalOvertime);
   }

   dailyRecordsMonth(date: Date): void {
      let workedHrs = 0;
      let monthOvertime = 0;

      this.recordDaysMonth = this.recordDays.filter(record => {
         return `${record.date.getFullYear()}-${record.date.getMonth()}` == `${date.getFullYear()}-${date.getMonth()}`;
      });
      // Calculating overtime data
      this.recordDaysMonth.forEach(dayRecord => {
         if (dayRecord.records.length) {
            workedHrs += dayRecord.is;
            monthOvertime += dayRecord.overtime;
         }
      });
      this.headInfo.workedHrs = TimeEntry.numbertimeToStringtime(workedHrs);
      this.headInfo.monthOvertime = TimeEntry.numbertimeToStringtime(monthOvertime);
   }
   /**
    * @param {int} index value to be either added or substracted from current month value
    * from current Month shown, get any other month to be displayed
    * according to the index selected
    */
   selectAnotherMonth(index: number): void {
      const monthYearOfToday = new Date(this.today.getFullYear(), this.today.getMonth());
      this.selectedMonthYear.setMonth(this.selectedMonthYear.getMonth() + index);
      if (this.selectedMonthYear.getTime() > monthYearOfToday.getTime() &&
         this.selectedMonthYear.getTime() <= this.lastValidDate.getTime()) {
         this.selectedMonthYear = new Date(monthYearOfToday);
         return
      }

      if (this.selectedMonthYear.getTime() < this.firstValidDate.getTime()) {
         this.selectedMonthYear.setMonth(this.selectedMonthYear.getMonth() + 1);
         this.selectedMonthYear = new Date(this.selectedMonthYear);
         return;
      }
      this.selectedMonthYear = new Date(this.selectedMonthYear); // => Doing this to refactor variable in the template
      //this.calendarInit(this.selectedMonthYear);
      //this.updateDailyRecords();
      this.dailyRecordsMonth(this.selectedMonthYear);
   }
   /**
    *
    * @param array array of dates in which a date is looking for
    * @param date Date beeing found inside the array
    * @returns the date founded or undefined if not
    */
   findingDateInArray(array: any[], date: Date): any {
      return array.find((d: any) => {
         let anyDay: Date = d.hasOwnProperty('date')
            ? new Date(d['date'])
            : new Date(d);
         return anyDay.toDateString() == date.toDateString();
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
      borderDate.setDate(this.selectedMonthYear.getDate() - periodOfValidity);
      const borderDateWeek = this.getWeekNumberFromDate(borderDate);
      const requestedDateWeek = this.getWeekNumberFromDate(date);

      return requestedDateWeek >= borderDateWeek;
   }

   dateToISOString(date: Date): string {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
   }
   /**
    * Helper function to get the week number from a given date
    * @param date date to find the according week number that belongs to.
    * @returns the week number from the year according to date
    */
   getWeekNumberFromDate(date: Date): number {
      const startDate = new Date(date.getFullYear(), 0, 1);
      let days = Math.floor(
         (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
      );

      return Math.ceil(days / 7);
   }

   addRecord(index: number): void {
      let record = new TimeEntry();
      this.openRecordEntryDialog(this.recordDaysMonth[index].date, record, this.recordDaysMonth[index].records)
   }

   editRecord(data: any) {
      let record = new TimeEntry(data.record)
      record.patchParseValue(data.record._originalParseObject);
      this.openRecordEntryDialog(data.record.startTime, record, this.recordDaysMonth[data.index].records)
   }

   deleteRecord(record: TimeEntry) {
      const recordDialogRef = this.dialog.open(SimpleDialogComponent, {
         data: {
            title: 'Delete Time Entry',
            content: `Would you like to delete record from ${TimeEntry.dateToStringtime(
               record.startTime
            )} to ${TimeEntry.dateToStringtime(record.endTime)}?`,
            cancelText: 'Cancel',
            okText: 'Delete',
         },
      });

      recordDialogRef.afterClosed().subscribe((result) => {
         if (result) {
            this.spinnerService.show();
            this.deleteTimeEntrySubscription = this.recordsService.deleteTimeEntry(record).subscribe({
               next: (result) => {
                  this.loadRecords();
                  this.spinnerService.hide();
               },
               error: (error) => {
                  console.error(error);
               },
            });
         }
      });
   }

   openRecordEntryDialog(date:Date, record: any, recordsByDate: any): void {
      const recordDialogRef = this.dialog.open(
         RecordEntryDialogComponent,
         {
            data: {
               record: record,
               recordsByDate: recordsByDate,
               date: date
            },
         }
      );

      recordDialogRef.afterClosed().subscribe((result) => {
         if (result) this.loadRecords();
      });
   }

   ngOnDestroy(): void {
      if (this.hollidaysSubscription)
         this.hollidaysSubscription.unsubscribe();
      if (this.deleteTimeEntrySubscription)
         this.deleteTimeEntrySubscription.unsubscribe();
   }
}
