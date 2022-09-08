import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Account } from '@app/core/_models/account';
import { Settings } from '@app/core/_models/setting';
import { IProject, Project } from '@app/core/_models/project';
import {
   DayRecord,
   IWorkinDaysHours,
   TimeEntry,
} from '@app/core/_models/time-entry';
import { AuthService } from '@app/core/_services';
import { RecordsService } from '../services/records.service';
import { RecordEntryDialogComponent } from '../components/record-entry-dialog/record-entry-dialog.component';
import { SimpleDialogComponent } from '@app/core/_components/simple-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-entry-list',
   templateUrl: './entry-list.component.html',
   styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit, OnDestroy {
   isAllRecordsReady: boolean = false;
   selectedDate!: Date;
   account!: Account;
   recordDays: DayRecord[] = [];
   records: Parse.Object[] = [];
   yearHolidays = [];

   //Subscriptions
   hollidaysSubscription!: Subscription;
   timeEntriesSubscription!:Subscription;
   deleteTimeEntrySubscription!: Subscription;

   constructor(
      private authService: AuthService,
      private recordsService: RecordsService,
      private dialog: MatDialog,
      private spinnerService: NgxSpinnerService
   ) {}

   ngOnInit(): void {
      this.selectedDate = new Date();
      this.account = this.authService.accountValue;
      console.log(this.account)
      const zone = this.account.settings.get('zone');

      this.spinnerService.show();
      this.hollidaysSubscription = this.recordsService.getHollidays(zone).subscribe({
         next: hollidays => {
            this.yearHolidays = hollidays.get('days');
            this.calendarInit(this.selectedDate);
            this.loadRecords();
         },
         error: error => {
            console.error(error);
         }
      });
   }
   /**
    * Method to get all TimeEntry records from server
    */
   loadRecords(): void {
      this.timeEntriesSubscription = this.recordsService.timeEntries.subscribe({
         next: (resp) => {
            this.records = resp;
            //Using the TimeEntry records to fill up the calendar table.
            this.updateDailyRecordsInMonth();
            this.isAllRecordsReady = true;
         },
         error: (error) => console.error(error),
         complete: () => {
            this.spinnerService.hide();
         },
      });
   }

   calendarInit(selectedDate: Date): void {
      let date = new Date(
         selectedDate.getFullYear(),
         selectedDate.getMonth(),
         1
      );
      this.recordDays = [];
      while (date.getMonth() === selectedDate.getMonth()) {
         let dayRecord: DayRecord = new DayRecord();
         dayRecord.date = new Date(date);
         this.recordDays.push(dayRecord);
         date.setDate(date.getDate() + 1);
      }
   }
   /**
    * @param {int} selectedDate current date containing the month from which the days are taken.
    * @return {Date[]} List with date objects for each day of the month
    */
   updateDailyRecordsInMonth(): void {
      const today = new Date();
      const wdh: IWorkinDaysHours = this.account.settings.get(
         'workingDaysHours'
      ) as IWorkinDaysHours;
      const workingDaysHours = [
         wdh.sunday,
         wdh.monday,
         wdh.tuesday,
         wdh.wednesday,
         wdh.thursday,
         wdh.friday,
         wdh.saturday,
      ];
      // const yearHolidays: any[] = this.account.settings.get('yearHolidays');
      const exceptionWorkingDays: any[] = this.account.settings.get(
         'exceptionWorkingDays'
      );

      this.recordDays.forEach((dayRecord) => {
         dayRecord.records = [];
         // iterating records to sort them according to date
         for (let index = 0; index < this.records.length; index++) {
            const _startTime = new Date(this.records[index].get('startTime'));
            if (
               dayRecord.date.toLocaleDateString() ===
               _startTime.toLocaleDateString()
            ) {
               dayRecord.records.push(new TimeEntry(this.records[index]));
            }
         }
         // Configuring every single record to display
         //handling data when is sunday
         if (
            dayRecord.date.getDay() == 0 &&
            workingDaysHours[dayRecord.date.getDay()] == 0
         ) {
            // if it is Sunday and it is not allow to work on Sundays
            dayRecord.description = 'Sunday';
            dayRecord.should = null;
            dayRecord.active = false;
            dayRecord.opened = false;
            dayRecord.isHolliday = true;
         }
         if (
            dayRecord.date.getDay() == 0 &&
            workingDaysHours[dayRecord.date.getDay()] != 0
         ) {
            // if it is Sunday and it is ALLOW to work on Sundays
            dayRecord.description = 'Working Sunday';
            dayRecord.should = workingDaysHours[dayRecord.date.getDay()];
            dayRecord.active = true;
            dayRecord.opened = false;
            dayRecord.isHolliday = true;
         }
         if (
            dayRecord.date.getDay() != 0 &&
            workingDaysHours[dayRecord.date.getDay()] == 0
         ) {
            // if it is any other week day and is NOT ALLOW to work on that day
            dayRecord.description = 'Not allow to work';
            dayRecord.should = null;
            dayRecord.active = false;
            dayRecord.opened = false;
            dayRecord.isHolliday = false;
         }
         const isHolliday = this.findingDateInArray(
            this.yearHolidays,
            dayRecord.date
         );
         if (
            dayRecord.date.getDay() != 0 &&
            workingDaysHours[dayRecord.date.getDay()] != 0 &&
            isHolliday
         ) {
            // if it is any other week day, it is ALLOW to work on that day
            // but it's holliday
            dayRecord.description = isHolliday.name;
            dayRecord.should = null;
            dayRecord.active = false;
            dayRecord.opened = false;
            dayRecord.isHolliday = true;
         }

         if (
            dayRecord.date.getDay() != 0 &&
            workingDaysHours[dayRecord.date.getDay()] != 0 &&
            !isHolliday
         ) {
            // a normal working day
            dayRecord.description = 'Working Day';
            dayRecord.should = workingDaysHours[dayRecord.date.getDay()];
            dayRecord.active = dayRecord.date < today;
            dayRecord.opened =
               this.isDateValid(dayRecord.date) &&
               dayRecord.date.getTime() <= this.selectedDate.getTime();
            dayRecord.isHolliday = false;
         }

         // finding out if there are any other authorized working day (initially didn't allow it)
         const isExceptionWorkingDay = this.findingDateInArray(
            exceptionWorkingDays,
            dayRecord.date
         );
         //console.log(isExceptionWorkingDay)
         if (isExceptionWorkingDay) {
            dayRecord.description = 'Exception Working Day';
            dayRecord.should = workingDaysHours[dayRecord.date.getDay()];
            dayRecord.active = dayRecord.date < today;
            dayRecord.opened =
               this.isDateValid(dayRecord.date) &&
               dayRecord.date.getTime() <= this.selectedDate.getTime();
            dayRecord.isHolliday = false;
         }
      });
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
      this.calendarInit(this.selectedDate);
      this.updateDailyRecordsInMonth();
   }
   /**
    *
    * @param array array of dates in which a date is looking for
    * @param date Date beeing found inside the array
    * @returns the date founded or undefined if not
    */
   findingDateInArray(array: any, date: Date): any {
      return array.find((d: any) => {
         let anyDay = d.hasOwnProperty('date')
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
      let days = Math.floor(
         (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
      );

      return Math.ceil(days / 7);
   }

   addRecord(index: number): void {
      let record = new TimeEntry();
      record.date = this.recordDays[index].date;
      this.openRecordEntryDialog(record, this.recordDays[index].records)
   }

   editRecord(data: any) {
      this.openRecordEntryDialog(data.record, this.recordDays[data.index].records)
   }

   deleteRecord(record: TimeEntry) {
      const recordDialogRef = this.dialog.open(SimpleDialogComponent, {
         data: {
            title: 'Delete Time Entry',
            content: `Would you like to delete record from ${TimeEntry.stringTimeFromDate(
               record.startTime
            )} to ${TimeEntry.stringTimeFromDate(record.endTime)}?`,
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

   openRecordEntryDialog(record: any, recordsByDate: any):void {
      const recordDialogRef = this.dialog.open(
         RecordEntryDialogComponent,
         {
            data: {
               record: record,
               recordsByDate: recordsByDate,
            },
         }
      );

      recordDialogRef.afterClosed().subscribe((result) => {
         if (result) this.loadRecords();
      });
   }

   ngOnDestroy():void {
      if(this.hollidaysSubscription)
      this.hollidaysSubscription.unsubscribe();
      if(this.timeEntriesSubscription)
      this.timeEntriesSubscription.unsubscribe();
      if(this.deleteTimeEntrySubscription)
      this.deleteTimeEntrySubscription.unsubscribe();
   }
}
